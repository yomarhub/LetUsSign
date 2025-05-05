"use client"

import type React from "react"
import { createContext } from "react"
import { AuthProvider as AuthHookProvider, useAuth as useAuthHook } from "@/hooks/useAuth"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "professor" | "student"
  establishmentId: string
  establishmentName: string
  classId?: string
  className?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthHookProvider>{children}</AuthHookProvider>
}

export function useAuth() {
  return useAuthHook()
}
