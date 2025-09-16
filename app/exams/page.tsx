"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Toaster, toast } from "sonner"
import { Search, Calendar, Clock, ExternalLink, Bell, BookOpen, Filter, Loader2 } from "lucide-react"
import Navbar from "../../components/navbar"

interface Exam {
  id: string
  name: string
  registrationDate: string
  deadlineDate: string
  registrationPortalLink: string
  eligibility: string
  description: string
}

export default function ExamExplorer() {
  const [exams, setExams] = useState<Exam[]>([])
  const [filteredExams, setFilteredExams] = useState<Exam[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [notifyingExams, setNotifyingExams] = useState<Set<string>>(new Set())
  // const { toast } = useToast()

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockExams: Exam[] = [
      {
        id: "123123",
        name: "JEE Main",
        registrationDate: "To be announced",
        deadlineDate: "To be announced",
        registrationPortalLink: "https://jeemain.nta.nic.in/",
        eligibility: "Class 12 pass with Physics, Chemistry and Mathematics",
        description:
          "Joint Entrance Examination (Main) for admission to NITs, IIITs, and other centrally funded technical institutions",
      },
      {
        id: "456456",
        name: "JEE Advanced",
        registrationDate: "May 2024",
        deadlineDate: "June 2024",
        registrationPortalLink: "https://jeeadv.ac.in/",
        eligibility: "Qualified JEE Main candidates in top 2,50,000",
        description: "Advanced level examination for admission to Indian Institutes of Technology (IITs)",
      },
      {
        id: "789789",
        name: "NEET UG",
        registrationDate: "March 2024",
        deadlineDate: "April 2024",
        registrationPortalLink: "https://neet.nta.nic.in/",
        eligibility: "Class 12 pass with Physics, Chemistry, Biology/Biotechnology",
        description: "National Eligibility cum Entrance Test for undergraduate medical courses",
      },
      {
        id: "101010",
        name: "GATE",
        registrationDate: "August 2024",
        deadlineDate: "September 2024",
        registrationPortalLink: "https://gate.iisc.ac.in/",
        eligibility: "Bachelor's degree in Engineering/Technology/Architecture",
        description: "Graduate Aptitude Test in Engineering for admission to postgraduate programs",
      },
      {
        id: "111111",
        name: "CAT",
        registrationDate: "July 2024",
        deadlineDate: "September 2024",
        registrationPortalLink: "https://iimcat.ac.in/",
        eligibility: "Bachelor's degree with at least 50% marks",
        description: "Common Admission Test for admission to Indian Institutes of Management (IIMs)",
      },
      {
        id: "111111",
        name: "CAT",
        registrationDate: "July 2024",
        deadlineDate: "September 2024",
        registrationPortalLink: "https://iimcat.ac.in/",
        eligibility: "Bachelor's degree with at least 50% marks",
        description: "Common Admission Test for admission to Indian Institutes of Management (IIMs)",
      },      
    ]

    // Simulate API loading
    setTimeout(() => {
      setExams(mockExams)
      setFilteredExams(mockExams)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter exams based on search term
  useEffect(() => {
    const filtered = exams.filter(
      (exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredExams(filtered)
  }, [searchTerm, exams])

  const handleNotifyMe = async (examId: string) => {
    setNotifyingExams((prev) => new Set(prev).add(examId))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock API call to /api/exam/notify/?id=<examId>
      const response = await fetch(`/api/exam/notify/?id=${examId}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("You'll be notified about updates for this exam.")
      } else {
        throw new Error("Failed to set notification")
      }
    } catch (error) {
      toast.error("Failed to set notification. Please try again.")
    } finally {
      setNotifyingExams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(examId)
        return newSet
      })
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading exams...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background ">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground mt-7">Exam Explorer</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty text-white">
              Discover and track important entrance exams for your career journey. Stay updated with registration dates
              and deadlines.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search exams by name, eligibility, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white dark:bg-card border-2 focus:border-blue-500 rounded-xl"
              />
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredExams.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No exams found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No exams available at the moment"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-foreground mb-2">{exam.name}</CardTitle>
                      <p className="text-muted-foreground text-sm text-pretty">{exam.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Registration Dates */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Registration:</span>
                          <Badge variant="outline" className="text-green-700 border-green-200">
                            {exam.registrationDate}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="font-medium">Deadline:</span>
                          <Badge variant="outline" className="text-red-700 border-red-200">
                            {exam.deadlineDate}
                          </Badge>
                        </div>
                      </div>

                      {/* Eligibility */}
                      <div>
                        <h4 className="font-medium text-sm mb-1 text-foreground">Eligibility:</h4>
                        <p className="text-sm text-muted-foreground text-pretty">{exam.eligibility}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => window.open(exam.registrationPortalLink, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Portal
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleNotifyMe(exam.id)}
                          disabled={notifyingExams.has(exam.id)}
                        >
                          {notifyingExams.has(exam.id) ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Bell className="h-4 w-4 mr-1" />
                          )}
                          {notifyingExams.has(exam.id) ? "Setting..." : "Notify Me"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
