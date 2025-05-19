import { api } from "@/lib/api"
import type { User, CreateUserRequest, PaginatedResponse } from "@/types/api"

export class UserService {
  // Récupérer tous les utilisateurs (admin uniquement)
  static async getUsers(params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
    establishmentId?: string
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await api.get<User[]>(`/users?${queryParams.toString()}`)
    return response as PaginatedResponse<User>
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Utilisateur non trouvé")
  }

  // Créer un utilisateur
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>("/users", userData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la création de l'utilisateur")
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la mise à jour")
  }

  // Supprimer un utilisateur
  static async deleteUser(id: string): Promise<void> {
    const response = await api.delete(`/users/${id}`)

    if (!response.success) {
      throw new Error(response.message || "Erreur lors de la suppression")
    }
  }

  // Changer le statut d'un utilisateur
  static async toggleUserStatus(id: string): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/toggle-status`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors du changement de statut")
  }

  // Réinitialiser le mot de passe
  static async resetPassword(id: string): Promise<{ temporaryPassword: string }> {
    const response = await api.post<{ temporaryPassword: string }>(`/users/${id}/reset-password`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Erreur lors de la réinitialisation")
  }
}
