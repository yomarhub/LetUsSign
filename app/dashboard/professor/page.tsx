"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, QrCode, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTodayCourses } from "@/hooks/useCourses"
import { useAuth } from "@/components/auth-provider"

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const { courses: todayCourses, isLoading } = useTodayCourses()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B468B]"></div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "upcoming":
        return <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Cours aujourd&apos;hui</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500">1 terminé, 1 à venir</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Élèves présents</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">26/28</div>
            <p className="text-xs text-green-600 font-medium">92.9% de présence</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">QR Codes actifs</CardTitle>
            <QrCode className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500">Expire dans 2h</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Retards</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">Ce matin</p>
          </CardContent>
        </Card>
      </div>

      {/* Cours du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-[#2B468B]" />
              Mes cours aujourd&apos;hui
            </span>
            <Link href="/dashboard/professor/courses">
              <Button variant="outline" size="sm">
                Voir tous les cours
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayCourses?.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">
                      {course.class} • {course.time}
                    </p>
                  </div>
                  {getStatusBadge(course.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {course.present}/{course.students} présents
                      </span>
                    </div>
                    {course.status !== "SCHEDULED" && (
                      <div className="flex items-center space-x-2">
                        <QrCode className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-mono">{course.qrCode}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {course.status === "SCHEDULED" && (
                      <Button size="sm" className="bg-[#2B468B] hover:bg-[#1a2d5a]">
                        Démarrer le cours
                      </Button>
                    )}
                    {course.status === "COMPLETED" && (
                      <Link href={`/dashboard/professor/attendance?course=${course.id}`}>
                        <Button variant="outline" size="sm">
                          Voir présences
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-[#2B468B]" />
              Générer un QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Créez un QR Code pour permettre aux élèves de signer leur présence rapidement.
            </p>
            <Link href="/dashboard/professor/qrcodes">
              <Button className="w-full bg-[#2B468B] hover:bg-[#1a2d5a]">Générer un QR Code</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-[#2B468B]" />
              Gestion des présences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Marquez manuellement les présences et absences de vos élèves.</p>
            <Link href="/dashboard/professor/attendance">
              <Button variant="outline" className="w-full">
                Gérer les présences
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Alertes et notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Retards fréquents</p>
                <p className="text-sm text-orange-700">3 élèves ont accumulé plus de 5 retards ce mois-ci</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Excellent taux de présence</p>
                <p className="text-sm text-blue-700">Votre classe Terminale S1 maintient un taux de présence de 95%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
