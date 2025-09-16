"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Brain, Upload, X, Plus, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/protected-route";
import { useAuth } from "../../contexts/auth-context";

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, updateUserData } = useAuth();

 const [formData, setFormData] = useState({
  name: user?.displayName || "",
  email: user?.email || "",
  phone: "",
  dob: "",
  location: "",
  currentEducation: {
    gradeLevel: "",
    schoolName: "",
    board: "",
    percentage: "",
    subjects: [] as string[],
    expectedGraduationYear: "",
  },
  // ✅ Replace `date` with `rank`
  testScores: [] as { testName: string; score: string; rank: string }[],
});


  const [newSubject, setNewSubject] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setUploadedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type === "application/pdf") {
      setUploadedFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "upload" && uploadedFile) {
        // ✅ Send PDF upload
        const formDataUpload = new FormData();
        formDataUpload.append("file", uploadedFile);
        formDataUpload.append("userId", user?.uid || "");

        const pdfResponse = await fetch("/api/onboard/pdfupload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!pdfResponse.ok) {
          const errText = await pdfResponse.text();
          throw new Error(`PDF upload failed: ${errText}`);
        }

        const pdfResult = await pdfResponse.json();
        console.log("✅ PDF upload response:", pdfResult);
      } else {
        // ✅ Save locally for auth context
        await updateUserData({
          phone: formData.phone,
          dob: formData.dob,
          location: formData.location,
          currentEducation: {
            ...formData.currentEducation,
            percentage: formData.currentEducation.percentage
              ? parseFloat(formData.currentEducation.percentage)
              : null,
            expectedGraduationYear: formData.currentEducation
              .expectedGraduationYear
              ? parseInt(formData.currentEducation.expectedGraduationYear)
              : null,
          },
          testScores: formData.testScores.map((test) => ({
  testName: test.testName,
  score: test.score ? parseFloat(test.score) : null,
  rank: test.rank || "",
})),

        });

        // ✅ Build backend payload
        const submitData = {
          id: user?.uid || "stu_" + Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          location: formData.location,
          currentEducation: {
            ...formData.currentEducation,
            percentage:
              parseFloat(formData.currentEducation.percentage.toString()) ||
              null,
            expectedGraduationYear:
              parseInt(
                formData.currentEducation.expectedGraduationYear.toString()
              ) || null,
          },
          testScores: formData.testScores.map((test) => ({
            testName: test.testName,
            score: parseFloat(test.score.toString()) || null,
            rank: test.rank,
          })),
        };

        const res = await fetch("/api/onboard/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Onboarding submit failed: ${errText}`);
        }

        const result = await res.json();
        console.log("✅ Backend response:", result);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Onboarding submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    activeTab === "upload"
      ? uploadedFile !== null
      : formData.name &&
        formData.email &&
        formData.phone &&
        formData.dob &&
        formData.location;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >

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
              <CardTitle className="text-2xl font-bold text-gray-900">
                Complete Your Student Profile
              </CardTitle>
              <p className="text-gray-600">Help us personalize your experience</p>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="upload"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Enter Details
                  </TabsTrigger>
                </TabsList>

                {/* PDF Upload */}
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
                        <p className="font-medium text-green-800">
                          {uploadedFile.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUploadedFile(null)}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-lg font-medium text-gray-700">
                          Drop your student profile PDF here
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Manual Form */}
                <TabsContent value="manual" className="space-y-6">
                  {/* Basic Info */}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      name="gradeLevel"
                      value={formData.currentEducation.gradeLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentEducation: {
                            ...prev.currentEducation,
                            gradeLevel: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g., 10th Grade, 12th Grade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      value={formData.currentEducation.schoolName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentEducation: {
                            ...prev.currentEducation,
                            schoolName: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter your school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board">Board</Label>
                    <Input
                      id="board"
                      name="board"
                      value={formData.currentEducation.board}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentEducation: {
                            ...prev.currentEducation,
                            board: e.target.value,
                          },
                        }))
                      }
                      placeholder="CBSE, ICSE, IB, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage / GPA</Label>
                    <Input
                      id="percentage"
                      name="percentage"
                      type="number"
                      value={formData.currentEducation.percentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentEducation: {
                            ...prev.currentEducation,
                            percentage: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter your percentage or GPA"
                    />
                  </div>

                  

{/* Subjects */}
<div className="space-y-2">
  <Label>Subjects</Label>
  <div className="flex flex-wrap gap-2 mb-2">
    {formData.currentEducation.subjects.map((subj, i) => (
      <Badge
        key={i}
        variant="secondary"
        className="flex items-center gap-1"
      >
        {subj}
        <X
          className="h-3 w-3 cursor-pointer hover:text-red-500"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              currentEducation: {
                ...prev.currentEducation,
                subjects: prev.currentEducation.subjects.filter(
                  (_, idx) => idx !== i
                ),
              },
            }))
          }
        />
      </Badge>
    ))}
  </div>
  <div className="flex gap-2">
    <Input
      value={newSubject}
      onChange={(e) => setNewSubject(e.target.value)}
      placeholder="Add subject and press Enter"
      onKeyDown={(e) => {
        if (e.key === "Enter" && newSubject.trim()) {
          setFormData((prev) => ({
            ...prev,
            currentEducation: {
              ...prev.currentEducation,
              subjects: [...prev.currentEducation.subjects, newSubject.trim()],
            },
          }));
          setNewSubject("");
        }
      }}
    />
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        if (newSubject.trim()) {
          setFormData((prev) => ({
            ...prev,
            currentEducation: {
              ...prev.currentEducation,
              subjects: [...prev.currentEducation.subjects, newSubject.trim()],
            },
          }));
          setNewSubject("");
        }
      }}
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
</div>


                  {/* Test Scores */}
                  <div className="space-y-2 ">
                    <Label className="pr-2">Test Scores</Label>
                    {formData.testScores.map((test, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Test Name"
                          value={test.testName}
                          onChange={(e) => {
                            const newScores = [...formData.testScores];
                            newScores[index].testName = e.target.value;
                            setFormData({ ...formData, testScores: newScores });
                          }}
                        />
                        <Input
                          placeholder="Score"
                          value={test.score}
                          onChange={(e) => {
                            const newScores = [...formData.testScores];
                            newScores[index].score = e.target.value;
                            setFormData({ ...formData, testScores: newScores });
                          }}
                        />
                           <Input
        placeholder="Rank"
        value={test.rank || ""}
        onChange={(e) => {
          const newScores = [...formData.testScores];
          newScores[index].rank = e.target.value;
          setFormData({ ...formData, testScores: newScores });
        }}
      />
                      </div>
                    ))}
       <Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() =>
    setFormData((prev) => ({
      ...prev,
      testScores: [...prev.testScores, { testName: "", score: "", rank: "" }],
    }))
  }
>
  + Add Test
</Button>

                  </div>
                </TabsContent>
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
  );
}
