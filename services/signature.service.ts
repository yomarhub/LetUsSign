import { api, uploadFile } from "@/lib/api"
import type { Signature, SignatureRequest, PaginatedResponse } from "@/types/api"

export class SignatureService {
  // Signer la présence
  static async signAttendance(signatureData: SignatureRequest): Promise<Signature> {
    // Convertir la signature base64 en Blob
    const base64Data = signatureData.signatureData.split(",")[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "image/png" })

    // Envoyer la signature avec les données du cours
    const response = await uploadFile("/signatures/sign", blob, {
      courseId: signatureData.courseId,
      qrCode: signatureData.qrCode,
      timestamp: signatureData.timestamp,
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la signature")
  }

  // Récupérer les signatures
  static async getSignatures(params?: {
    page?: number
    limit?: number
    studentId?: string
    courseId?: string
    date?: string
    status?: string
  }): Promise<PaginatedResponse<Signature>> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await api.get<Signature[]>(`/signatures?${queryParams.toString()}`)
    return response as PaginatedResponse<Signature>
  }

  // Récupérer une signature par ID
  static async getSignatureById(id: string): Promise<Signature> {
    const response = await api.get<Signature>(`/signatures/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Signature non trouvée")
  }

  // Marquer manuellement la présence (professeur)
  static async markAttendance(
    courseId: string,
    studentId: string,
    status: "present" | "absent" | "late",
  ): Promise<Signature> {
    const response = await api.post<Signature>("/signatures/manual", {
      courseId,
      studentId,
      status,
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors du marquage de présence")
  }

  // Récupérer l'historique des signatures d'un étudiant
  static async getStudentSignatures(
    studentId: string,
    params?: {
      page?: number
      limit?: number
      startDate?: string
      endDate?: string
    },
  ): Promise<PaginatedResponse<Signature>> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await api.get<Signature[]>(`/signatures/student/${studentId}?${queryParams.toString()}`)
    return response as PaginatedResponse<Signature>
  }

  // Récupérer les présences d'un cours
  static async getCourseAttendance(courseId: string): Promise<{
    signatures: Signature[]
    stats: {
      totalStudents: number
      presentCount: number
      absentCount: number
      lateCount: number
      attendanceRate: number
    }
  }> {
    const response = await api.get(`/signatures/course/${courseId}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la récupération des présences")
  }
}
