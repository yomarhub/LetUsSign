"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Image from "next/image"

type Student = {
  id: string
  name: string
  email: string
  status: "present" | "absent" | "pending"
  signatureTime?: string
  signatureImage?: string
}

type Course = {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
  students: Student[]
  location: string
}

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>("1")

  // Données simulées pour les cours
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Introduction aux mathématiques",
      date: "31/05/2025",
      startTime: "09:00",
      endTime: "11:00",
      location: "Salle A101",
      students: [
        {
          id: "1",
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          status: "present",
          signatureTime: "09:05",
          signatureImage: "/placeholder.svg?height=100&width=200",
        },
        {
          id: "2",
          name: "Marie Martin",
          email: "marie.martin@email.com",
          status: "absent",
        },
        {
          id: "3",
          name: "Lucas Bernard",
          email: "lucas.bernard@email.com",
          status: "present",
          signatureTime: "09:02",
          signatureImage: "/placeholder.svg?height=100&width=200",
        },
        {
          id: "4",
          name: "Sophie Petit",
          email: "sophie.petit@email.com",
          status: "pending",
        },
        {
          id: "5",
          name: "Thomas Leroy",
          email: "thomas.leroy@email.com",
          status: "present",
          signatureTime: "09:10",
          signatureImage: "/placeholder.svg?height=100&width=200",
        },
      ],
    },
    {
      id: "2",
      name: "Mécanique quantique",
      date: "01/06/2025",
      startTime: "09:00",
      endTime: "12:00",
      location: "Salle B205",
      students: [
        {
          id: "1",
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          status: "pending",
        },
        {
          id: "2",
          name: "Marie Martin",
          email: "marie.martin@email.com",
          status: "pending",
        },
        {
          id: "3",
          name: "Lucas Bernard",
          email: "lucas.bernard@email.com",
          status: "pending",
        },
        {
          id: "4",
          name: "Sophie Petit",
          email: "sophie.petit@email.com",
          status: "pending",
        },
        {
          id: "5",
          name: "Thomas Leroy",
          email: "thomas.leroy@email.com",
          status: "pending",
        },
      ],
    },
  ])

  const handleSignatureClick = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleStatusChange = (studentId: string, newStatus: "present" | "absent") => {
    setCourses(
      courses.map((course) => {
        if (course.id === selectedCourseId) {
          return {
            ...course,
            students: course.students.map((student) => {
              if (student.id === studentId) {
                return {
                  ...student,
                  status: newStatus,
                  signatureTime:
                    newStatus === "present"
                      ? new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      : undefined,
                }
              }
              return student
            }),
          }
        }
        return course
      }),
    )
  }

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || courses[0]

  const filteredStudents = selectedCourse.students.filter((student) => {
    const searchTerm = searchQuery.toLowerCase()
    return student.name.toLowerCase().includes(searchTerm) || student.email.toLowerCase().includes(searchTerm)
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Présent</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const presentCount = selectedCourse.students.filter((s) => s.status === "present").length
  const absentCount = selectedCourse.students.filter((s) => s.status === "absent").length
  const pendingCount = selectedCourse.students.filter((s) => s.status === "pending").length

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedCourse.students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absents</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection du cours et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des présences</CardTitle>
          <CardDescription>
            Gérez les présences pour vos cours et visualisez les signatures des étudiants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} - {course.date} ({course.startTime}-{course.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* Informations du cours sélectionné */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Cours:</span> {selectedCourse.name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {selectedCourse.date}
              </div>
              <div>
                <span className="font-medium">Horaire:</span> {selectedCourse.startTime} - {selectedCourse.endTime}
              </div>
              <div>
                <span className="font-medium">Lieu:</span> {selectedCourse.location}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des étudiants */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(student.status)}
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                    {student.signatureTime && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Signé à {student.signatureTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusBadge(student.status)}

                  {student.status === "pending" && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(student.id, "present")}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Présent
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(student.id, "absent")}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Absent
                      </Button>
                    </div>
                  )}

                  {student.signatureImage && (
                    <Button size="sm" variant="outline" onClick={() => handleSignatureClick(student)}>
                      Voir signature
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal pour afficher la signature */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Signature de {selectedStudent?.name}</DialogTitle>
            <DialogDescription>Signature effectuée le {selectedStudent?.signatureTime}</DialogDescription>
          </DialogHeader>
          {selectedStudent?.signatureImage && (
            <Image
              src={selectedStudent.signatureImage || "/placeholder.svg"}
              alt="Signature"
              width={200}
              height={100}
              className="border rounded-lg max-w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div >
  )
}
