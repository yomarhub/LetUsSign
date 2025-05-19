"use client"

import { useState, useEffect } from "react"
import { CourseService } from "@/services/course.service"
import type { Course, CreateCourseRequest } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

export function useCourses(params?: {
  page?: number
  limit?: number
  professorId?: string
  classId?: string
  date?: string
  status?: string
  search?: string
}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await CourseService.getCourses(params)
      setCourses(response.data || [])
      setPagination(response.pagination)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.limit, params?.professorId, params?.classId, params?.date, params?.status, params?.search])

  const createCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
    try {
      const newCourse = await CourseService.createCourse(courseData)
      setCourses((prev) => [newCourse, ...prev])
      toast({
        title: "Succès",
        description: "Cours créé avec succès",
      })
      return newCourse
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la création du cours",
        variant: "destructive",
      })
      throw err
    }
  }

  const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const updatedCourse = await CourseService.updateCourse(id, courseData)
      setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))
      toast({
        title: "Succès",
        description: "Cours mis à jour avec succès",
      })
      return updatedCourse
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la mise à jour",
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteCourse = async (id: string): Promise<void> => {
    try {
      await CourseService.deleteCourse(id)
      setCourses((prev) => prev.filter((course) => course.id !== id))
      toast({
        title: "Succès",
        description: "Cours supprimé avec succès",
      })
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la suppression",
        variant: "destructive",
      })
      throw err
    }
  }

  const startCourse = async (id: string): Promise<Course> => {
    try {
      const updatedCourse = await CourseService.startCourse(id)
      setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))
      toast({
        title: "Succès",
        description: "Cours démarré avec succès",
      })
      return updatedCourse
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors du démarrage",
        variant: "destructive",
      })
      throw err
    }
  }

  const endCourse = async (id: string): Promise<Course> => {
    try {
      const updatedCourse = await CourseService.endCourse(id)
      setCourses((prev) => prev.map((course) => (course.id === id ? updatedCourse : course)))
      toast({
        title: "Succès",
        description: "Cours terminé avec succès",
      })
      return updatedCourse
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la fin du cours",
        variant: "destructive",
      })
      throw err
    }
  }

  return {
    courses,
    pagination,
    isLoading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    startCourse,
    endCourse,
  }
}

// Hook pour les cours du jour
export function useTodayCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodayCourses = async () => {
      try {
        setIsLoading(true)
        const todayCourses = await CourseService.getTodayCourses()
        setCourses(todayCourses)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayCourses()
  }, [])

  return { courses, isLoading, error, refetch: () => window.location.reload() }
}
