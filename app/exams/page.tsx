"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Toaster, toast } from "sonner"
import {
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Bell,
  BookOpen,
  Filter,
  Loader2,
} from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [notifyingExams, setNotifyingExams] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_EXAM_URL}?field=medical`,
          { method: "GET", cache: "no-store" }
        )

        if (!resp.ok) {
          throw new Error(`Failed to fetch exams: ${resp.status} ${resp.statusText}`)
        }

        const data: Exam[] = await resp.json()
        setExams(data)
        setFilteredExams(data)
      } catch (err: any) {
        console.error("Error fetching exams:", err)
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  useEffect(() => {
    const filtered = exams.filter(
      (exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredExams(filtered)
  }, [searchTerm, exams])

  // const handleNotifyMe = async (examId: string) => {
  //   setNotifyingExams((prev) => new Set(prev).add(examId))

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_EXAM_URL}/ai/notify?examId=${examId}`,
  //       { method: "GET", cache: "no-store" }
  //     )

  //     if (response.ok) {
  //       toast.success("You'll be notified about updates for this exam.")
  //     } else {
  //       const text = await response.text()
  //       throw new Error(text || "Failed to set notification")
  //     }
  //   } catch (error: any) {
  //     toast.error(`Failed to set notification. ${error.message}`)
  //   } finally {
  //     setNotifyingExams((prev) => {
  //       const s = new Set(prev)
  //       s.delete(examId)
  //       return s
  //     })
  //   }
  // }

  const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-muted-foreground">Loading exams...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center text-red-500">
        Error loading exams: {error}
      </div>
    </div>
  )

  function handleNotifyMe(id: string): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-4 text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            Exam Explorer
          </motion.h1>
          <motion.p className="text-xl text-white max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            Discover and track important entrance exams for your career journey. Stay updated with registration dates and deadlines.
          </motion.p>

          {/* Search */}
          <motion.div className="max-w-2xl mx-auto mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search exams..."
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
            <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No exams found</h3>
              <p className="text-muted-foreground">{searchTerm ? "Try adjusting your search terms" : "No exams available"}</p>
            </motion.div>
          ) : (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
              {filteredExams.map((exam) => (
                <motion.div key={exam.id} variants={fadeInUp} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-foreground mb-2">{exam.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{exam.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Registration:</span>
                          <Badge variant="outline" className="text-green-700 border-green-200">{exam.registrationDate}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="font-medium">Deadline:</span>
                          <Badge variant="outline" className="text-red-700 border-red-200">{exam.deadlineDate}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-1 text-foreground">Eligibility:</h4>
                        <p className="text-sm text-muted-foreground">{exam.eligibility}</p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(exam.registrationPortalLink, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Portal
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleNotifyMe(exam.id)} disabled={notifyingExams.has(exam.id)}>
                          {notifyingExams.has(exam.id) ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Bell className="h-4 w-4 mr-1" />}
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
