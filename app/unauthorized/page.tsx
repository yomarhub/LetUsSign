"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  const { user, logout } = useAuth()

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role.toLowerCase()) {
      case "admin":
        return "/dashboard/admin"
      case "professor":
        return "/dashboard/professor"
      case "student":
        return "/dashboard/student"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Accès non autorisé</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.</p>

          {user && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Connecté en tant que :{" "}
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
              </p>
              <p className="text-sm text-blue-600">
                Rôle :{" "}
                <strong>
                  {user.role.toLowerCase() === "admin" ? "Administrateur" : user.role.toLowerCase() === "professor" ? "Professeur" : "Élève"}
                </strong>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Link href={getDashboardLink()}>
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </Link>

            <Button variant="outline" onClick={logout} className="w-full">
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
