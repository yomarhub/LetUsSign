"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requireAuth?: boolean
}

export function RouteGuard({ children, allowedRoles = [], requireAuth = true }: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Vérifier l'authentification
      if (requireAuth && !isAuthenticated) {
        router.push("/")
        return
      }

      // Vérifier les rôles (insensible à la casse)
      if (allowedRoles.length > 0 && user && !allowedRoles.some(r => r.toLowerCase() === user.role.toLowerCase())) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, isAuthenticated, requireAuth, allowedRoles, router])

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2B468B] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Ne pas afficher le contenu si l'utilisateur n'a pas les bonnes permissions
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.some(r => r.toLowerCase() === user.role.toLowerCase())) {
    return null
  }

  return <>{children}</>
}
