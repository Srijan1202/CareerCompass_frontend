"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Upload, X, Plus, FileText, User } from "lucide-react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "../../components/protected-route"
import { useAuth } from "../../contexts/auth-context"

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, updateUserData } = useAuth()

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    dreamJob: "",
    education: "",
    experience: "",
    skills: [] as string[],
    interests: [] as string[],
    achievements: [] as string[],
  })

  const [newTag, setNewTag] = useState({
    skills: "",
    interests: "",
    achievements: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleTagAdd = (field: "skills" | "interests" | "achievements") => {
    const value = newTag[field].trim()
    if (value && !formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }))
      setNewTag((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleTagRemove = (field: "skills" | "interests" | "achievements", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent, field: "skills" | "interests" | "achievements") => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTagAdd(field)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === "application/pdf") {
      setUploadedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && files[0].type === "application/pdf") {
      setUploadedFile(files[0])
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (activeTab === "upload" && uploadedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", uploadedFile)
        formDataUpload.append("userId", user?.uid || "")

        const pdfResponse = await fetch("/api/onboard/pdf", {
          method: "POST",
          body: formDataUpload,
        })

        if (!pdfResponse.ok) {
          throw new Error("Failed to upload PDF")
        }

        const pdfResult = await pdfResponse.json()
        console.log("PDF upload response:", pdfResult)
      } else {
        await updateUserData({
          dreamJob: formData.dreamJob,
          education: formData.education,
          skills: formData.skills,
          interests: formData.interests,
          achievements: formData.achievements.join(", "),
          experience: formData.experience,
        })

        const submitData = {
          userId: user?.uid || "",
          firstName: formData.name.split(" ")[0] || "",
          lastName: formData.name.split(" ").slice(1).join(" ") || "",
          email: formData.email,
          dreamJob: formData.dreamJob,
          authProvider: "firebase",
          socialLinks: {
            linkedin: "https://linkedin.com/in/yourprofile",
            github: "https://github.com/yourprofile",
          },
        }

        const res = await fetch("/api/onboard/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })

        if (!res.ok) throw new Error("Failed to submit onboarding")

        const result = await res.json()
        console.log("Backend response:", result)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding submission failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    activeTab === "upload" ? uploadedFile !== null : formData.name && formData.email && formData.dreamJob

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Progress Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Step 1 of 1 – Onboarding</span>
            </div>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
              <p className="text-gray-600">Help us personalize your CareerCompass experience</p>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Enter Details
                  </TabsTrigger>
                </TabsList>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver
                          ? "border-blue-400 bg-blue-50"
                          : uploadedFile
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {uploadedFile ? (
                        <div className="space-y-3">
                          <FileText className="h-12 w-12 text-green-600 mx-auto" />
                          <div>
                            <p className="font-medium text-green-800">{uploadedFile.name}</p>
                            <p className="text-sm text-green-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadedFile(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-700">Drop your resume or profile PDF here</p>
                            <p className="text-sm text-gray-500">or click to browse files</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dreamJob">Dream Job *</Label>
                      <Input
                        id="dreamJob"
                        name="dreamJob"
                        value={formData.dreamJob}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Textarea
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="Describe your educational background"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Describe your work experience"
                        rows={3}
                      />
                    </div>

                    {/* Skills Tags */}
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => handleTagRemove("skills", index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag.skills}
                          onChange={(e) => setNewTag((prev) => ({ ...prev, skills: e.target.value }))}
                          onKeyPress={(e) => handleTagKeyPress(e, "skills")}
                          placeholder="Add a skill and press Enter"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => handleTagAdd("skills")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Interests Tags */}
                    <div className="space-y-2">
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {interest}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => handleTagRemove("interests", index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag.interests}
                          onChange={(e) => setNewTag((prev) => ({ ...prev, interests: e.target.value }))}
                          onKeyPress={(e) => handleTagKeyPress(e, "interests")}
                          placeholder="Add an interest and press Enter"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => handleTagAdd("interests")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Achievements Tags */}
                    <div className="space-y-2">
                      <Label>Achievements</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.achievements.map((achievement, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {achievement}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => handleTagRemove("achievements", index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag.achievements}
                          onChange={(e) => setNewTag((prev) => ({ ...prev, achievements: e.target.value }))}
                          onKeyPress={(e) => handleTagKeyPress(e, "achievements")}
                          placeholder="Add an achievement and press Enter"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => handleTagAdd("achievements")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              </Tabs>

              <div className="mt-8 pt-6 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {isLoading ? "Setting up your profile..." : "Continue to Dashboard"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
