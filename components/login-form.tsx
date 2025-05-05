"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, Mail, Lock, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { LoginRequest } from "@/types/api"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    try {
      const credentials: LoginRequest = { email, password }
      await login(credentials)
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects. Veuillez réessayer.")
    }
  }

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Adresse email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="votre@email.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-12 border-gray-300 focus:border-[#2B468B] focus:ring-[#2B468B] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Mot de passe
          </Label>
          <button type="button" className="text-sm text-[#2B468B] hover:underline font-medium transition-colors">
            Mot de passe oublié ?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#2B468B] focus:ring-[#2B468B] transition-colors"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-[#2B468B] hover:bg-[#1a2d5a] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Connexion en cours...
          </div>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Se connecter
          </>
        )}
      </Button>

      {/* Boutons de connexion rapide pour la démo */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 text-center">Connexion rapide (démo) :</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickLogin("admin@letussign.com", "demo123")}
            className="text-xs"
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickLogin("j.martin@lycee-jeanmoulin.fr", "demo123")}
            className="text-xs"
          >
            Prof
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => quickLogin("lucas.roux@student.lycee-jm.fr", "demo123")}
            className="text-xs"
          >
            Élève
          </Button>
        </div>
      </div>
    </form>
  )
}
