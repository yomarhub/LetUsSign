"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthService } from "@/services/auth.service"
import type { User, LoginRequest } from "@/types/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            // Vérifier que le token est toujours valide
            try {
              const profile = await AuthService.getProfile()
              setUser(profile)
            } catch (error) {
              console.error("Token invalide, déconnexion:", error)
              await logout()
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error)
        await logout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await AuthService.login(credentials)
      setUser(response.user)

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${response.user.firstName} ${response.user.lastName}`,
      })

      // Redirection selon le rôle avec un délai pour laisser le temps au toast de s'afficher
      setTimeout(() => {
        const role = response.user.role
        switch (role) {
          case "ADMIN":
            router.push("/dashboard/admin")
            break
          case "PROFESSOR":
            router.push("/dashboard/professor")
            break
          case "STUDENT":
            router.push("/dashboard/student")
            break
          default:
            router.push("/dashboard")
            break
        }
      }, 500)
    } catch (error: any) {
      console.error("Erreur de connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      setUser(null)
      router.push("/")
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      })
    }
  }

  const refreshProfile = async () => {
    try {
      const updatedUser = await AuthService.getProfile()
      setUser(updatedUser)
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du profil:", error)
      await logout()
    }
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false

    const userRole = user.role.toLowerCase()
    if (Array.isArray(role)) {
      return role.map((r) => r.toLowerCase()).includes(userRole)
    }

    return userRole === role.toLowerCase()
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshProfile,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
