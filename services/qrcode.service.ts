import { api } from "@/lib/api"
import type { QRCode, GenerateQRRequest, Course } from "@/types/api"

export class QRCodeService {
  // Générer un QR code pour un cours
  static async generateQRCode(data: GenerateQRRequest): Promise<QRCode> {
    const response = await api.post<QRCode>("/qrcodes/generate", data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la génération du QR code")
  }

  // Récupérer les QR codes actifs
  static async getActiveQRCodes(professorId?: string): Promise<QRCode[]> {
    const params = professorId ? `?professorId=${professorId}` : ""
    const response = await api.get<QRCode[]>(`/qrcodes/active${params}`)

    if (response.success && response.data) {
      return response.data
    }

    return []
  }

  // Valider un QR code
  static async validateQRCode(code: string): Promise<{
    valid: boolean
    course?: Course
    message?: string
  }> {
    const response = await api.post(`/qrcodes/validate`, { code })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "QR code invalide")
  }

  // Désactiver un QR code
  static async deactivateQRCode(id: string): Promise<void> {
    const response = await api.patch(`/qrcodes/${id}/deactivate`)

    if (!response.success) {
      throw new Error(response.message || "Erreur lors de la désactivation")
    }
  }

  // Récupérer les statistiques d'un QR code
  static async getQRCodeStats(id: string): Promise<{
    scansCount: number
    uniqueScans: number
    lastScanAt?: string
  }> {
    const response = await api.get(`/qrcodes/${id}/stats`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la récupération des statistiques")
  }
}
