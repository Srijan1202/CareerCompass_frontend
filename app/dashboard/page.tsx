"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Brain, Target, TrendingUp, User, Mail, Phone, MapPin, GraduationCap, Calendar, Award } from "lucide-react"
import ProtectedRoute from "../../components/protected-route"
import { useAuth } from "../../contexts/auth-context"

export default function DashboardPage() {
  const { user, userData } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {userData?.name?.split(" ")[0] || user?.displayName?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-xl text-gray-600">Your AI-powered academic journey continues</p>
          </div>

          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Student Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{userData?.name || user?.displayName || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData?.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{userData?.location || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Academic Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.currentEducation?.percentage || 0}%</div>
                <p className="text-xs text-muted-foreground">Current academic performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.currentEducation?.subjects?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Enrolled subjects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Scores</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.testScores?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Recorded test scores</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graduation</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.currentEducation?.expectedGraduationYear || "TBD"}</div>
                <p className="text-xs text-muted-foreground">Expected graduation year</p>
              </CardContent>
            </Card>
          </div>

          {userData?.currentEducation && (
            <div className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Current Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Grade Level</p>
                      <p className="font-medium">{userData.currentEducation.gradeLevel || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">School Name</p>
                      <p className="font-medium">{userData.currentEducation.schoolName || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Board</p>
                      <p className="font-medium">{userData.currentEducation.board || "Not specified"}</p>
                    </div>
                  </div>
                  {userData.currentEducation.subjects && userData.currentEducation.subjects.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.currentEducation.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {userData?.testScores && userData.testScores.length > 0 && (
            <div className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Test Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.testScores.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{test.testName}</p>
                          {test.rank && <p className="text-sm text-gray-500">Rank: {test.rank}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{test.score || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Academic Insights Coming Soon</h3>
                <p className="text-gray-600">
                  Your personalized academic insights and AI-powered study recommendations are being prepared. Check
                  back soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
