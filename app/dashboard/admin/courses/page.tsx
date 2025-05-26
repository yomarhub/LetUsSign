"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Edit, Trash, Download, Filter, Calendar } from "lucide-react"
import { CourseModal } from "@/components/course-modal"
import { useCourses } from "@/hooks/useCourses"
import type { Course, User } from "@/types/api"
import { getName } from "@/lib/utils"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const { courses, isLoading, createCourse, updateCourse, deleteCourse } = useCourses({ search: searchQuery })

  const handleAddCourse = () => {
    setSelectedCourse(null)
    setIsModalOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programmé</Badge>
      case "in-progress":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">En cours</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Terminé</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredCourses = courses?.filter((course) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      course.name.toLowerCase().includes(searchTerm) ||
      course.subject.toLowerCase().includes(searchTerm) ||
      getName(course.professor).toLowerCase().includes(searchTerm)
    )
  })

  const formatTime = (time: string) => time ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un cours..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddCourse} className="bg-[#2B468B] hover:bg-[#1a2d5a]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un cours
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du cours</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Professeur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Horaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.subject}</TableCell>
                <TableCell>{getName(course.professor)}</TableCell>
                <TableCell>{course.date}</TableCell>
                <TableCell>
                  {formatTime(course.startTime)} - {formatTime(course.endTime)}
                </TableCell>
                <TableCell>{getStatusBadge(course.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} course={selectedCourse} />
    </div>
  )
}
