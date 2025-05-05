"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Rediriger vers le dashboard approprié selon le rôle
      switch (user.role.toLowerCase()) {
        case "admin":
          router.push("/dashboard/admin")
          break
        case "professor":
          router.push("/dashboard/professor")
          break
        case "student":
          router.push("/dashboard/student")
          break
      }
    }
  }, [user, isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2B468B] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return null // L'utilisateur sera redirigé
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex min-h-screen">
        {/* Partie gauche - Branding et informations */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#2B468B] to-[#1a2d5a] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute top-1/2 right-32 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">LetUsSign</h1>
              <p className="text-xl opacity-90 mb-2">Écoles de Lyon</p>
              <p className="text-lg opacity-75">Gestion moderne des présences</p>
            </div>

            <div className="max-w-md mb-12">
              <Image
                src="/placeholder.svg"
                alt="Signature numérique moderne"
                width={300}
                height={300}
                className="w-full h-auto opacity-90 drop-shadow-2xl"
              />
            </div>

            <div className="text-center max-w-lg">
              <h2 className="text-2xl font-semibold mb-6">Révolutionnez la gestion des présences</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <p className="opacity-90">QR Codes et signatures numériques</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <p className="opacity-90">Suivi en temps réel des absences</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <p className="opacity-90">Rapports automatisés</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <p className="opacity-90">Conformité RGPD</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm opacity-75">Développé par Omar, Noah, Benjamin & Pablo</p>
            </div>
          </div>
        </div>

        {/* Partie droite - Formulaire de connexion */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-[#2B468B] mb-2">LetUsSign</h1>
              <p className="text-gray-600">Écoles de Lyon</p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
                  <p className="text-gray-600">Accédez à votre espace de gestion des présences</p>
                </div>

                <LoginForm />

                {/* Informations de démonstration */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Comptes de démonstration :</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-800">Administrateur :</span>
                      <span className="text-blue-700">admin@letussign.fr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-800">Professeur :</span>
                      <span className="text-blue-700">prof@letussign.fr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-800">Élève :</span>
                      <span className="text-blue-700">eleve@letussign.fr</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300">
                      <span className="text-blue-600">Mot de passe : </span>
                      <span className="font-mono text-blue-800">demo123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
