import { api } from "@/lib/api"
import type { Course, CreateCourseRequest, PaginatedResponse } from "@/types/api"

export class CourseService {
  // Récupérer les cours
  static async getCourses(params?: {
    page?: number
    limit?: number
    professorId?: string
    classId?: string
    date?: string
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Course>> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await api.get<Course[]>(`/courses?${queryParams.toString()}`)
    return response as PaginatedResponse<Course>
  }

  // Récupérer un cours par ID
  static async getCourseById(id: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Cours non trouvé")
  }

  // Créer un cours
  static async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    const response = await api.post<Course>("/courses", courseData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la création du cours")
  }

  // Mettre à jour un cours
  static async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    const response = await api.put<Course>(`/courses/${id}`, courseData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la mise à jour")
  }

  // Supprimer un cours
  static async deleteCourse(id: string): Promise<void> {
    const response = await api.delete(`/courses/${id}`)

    if (!response.success) {
      throw new Error(response.message || "Erreur lors de la suppression")
    }
  }

  // Démarrer un cours
  static async startCourse(id: string): Promise<Course> {
    const response = await api.patch<Course>(`/courses/${id}/start`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors du démarrage du cours")
  }

  // Terminer un cours
  static async endCourse(id: string): Promise<Course> {
    const response = await api.patch<Course>(`/courses/${id}/end`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la fin du cours")
  }

  // Récupérer les cours du jour pour un utilisateur
  static async getTodayCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>("/courses/today")

    if (response.success && response.data) {
      return response.data
    }

    return []
  }

  // Récupérer les statistiques d'un cours
  static async getCourseStats(id: string): Promise<{
    totalStudents: number
    presentStudents: number
    absentStudents: number
    lateStudents: number
    attendanceRate: number
  }> {
    const response = await api.get(`/courses/${id}/stats`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la récupération des statistiques")
  }
}
