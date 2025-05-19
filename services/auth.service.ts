import { api } from "@/lib/api"
import type { LoginRequest, LoginResponse, User } from "@/types/api"

export class AuthService {
  // Connexion
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials)

      if (response.success && response.data) {
        // Stocker le token et les données utilisateur
        localStorage.setItem("letussign_token", response.data.token)
        localStorage.setItem("letussign_user", JSON.stringify(response.data.user))

        return response.data
      }

      throw new Error(response.message || "Erreur de connexion")
    } catch (error: any) {
      console.error("Erreur AuthService.login:", error)
      throw new Error(error.message || "Erreur de connexion au serveur")
    }
  }

  // Déconnexion
  static async logout(): Promise<void> {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      localStorage.removeItem("letussign_token")
      localStorage.removeItem("letussign_user")
    }
  }

  // Récupérer le profil utilisateur
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>("/auth/me")

      if (response.success && response.data) {
        // Mettre à jour les données utilisateur stockées
        localStorage.setItem("letussign_user", JSON.stringify(response.data))
        return response.data
      }

      throw new Error(response.message || "Erreur lors de la récupération du profil")
    } catch (error: any) {
      console.error("Erreur AuthService.getProfile:", error)
      throw new Error(error.message || "Erreur de récupération du profil")
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem("letussign_token")
    const user = localStorage.getItem("letussign_user")
    return !!(token && user)
  }

  // Récupérer l'utilisateur depuis le localStorage
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("letussign_user")
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error)
        localStorage.removeItem("letussign_user")
      }
    }
    return null
  }

  // Vérifier les permissions
  static hasRole(requiredRole: string | string[]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const userRole = user.role.toLowerCase()
    if (Array.isArray(requiredRole)) {
      return requiredRole.map((r) => r.toLowerCase()).includes(userRole)
    }

    return userRole === requiredRole.toLowerCase()
  }

  // Rafraîchir le token
  static async refreshToken(): Promise<string> {
    try {
      const response = await api.post<{ token: string }>("/auth/refresh")

      if (response.success && response.data) {
        localStorage.setItem("letussign_token", response.data.token)
        return response.data.token
      }

      throw new Error("Impossible de rafraîchir le token")
    } catch (error: any) {
      console.error("Erreur AuthService.refreshToken:", error)
      throw new Error("Impossible de rafraîchir le token")
    }
  }
}
