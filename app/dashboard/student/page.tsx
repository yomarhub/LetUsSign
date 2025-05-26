"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileSignature, QrCode, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTodayCourses } from "@/hooks/useCourses"
import { useStudentSignatures } from "@/hooks/useSignatures"
import { useAuth } from "@/components/auth-provider"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { courses: todayCourses, isLoading: coursesLoading } = useTodayCourses()
  const { signatures: recentSignatures, isLoading: signaturesLoading } = useStudentSignatures(user?.id || "", { limit: 4 })

  if (coursesLoading || signaturesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B468B]"></div>
      </div>
    )
  }

  // Utiliser les vraies données dans l'affichage
  // todayCourses et recentSignatures contiennent maintenant les vraies données

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-100 text-green-800">Signé</Badge>
      case "missed":
        return <Badge className="bg-red-100 text-red-800">Manqué</Badge>
      case "upcoming":
        return <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSignatureStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "late":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Cours aujourd&apos;hui</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">1 signé, 1 manqué, 1 à venir</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de présence</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">94%</div>
            <p className="text-xs text-green-600 font-medium">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Signatures</CardTitle>
            <FileSignature className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-gray-500">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Retards</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500">Ce mois-ci</p>
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
            <Link href="/dashboard/student/schedule">
              <Button variant="outline" size="sm">
                Voir planning complet
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">
                      {course.professor?.firstName} {course.professor?.lastName} • {course.startTime}
                    </p>
                    {course.signTime && <p className="text-xs text-green-600 mt-1">Signé à {course.signTime}</p>}
                  </div>
                  {getStatusBadge(course.status)}
                </div>

                <div className="flex justify-end">
                  {course.status === "SCHEDULED" && (
                    <Link href="/dashboard/student/scan">
                      <Button size="sm" className="bg-[#2B468B] hover:bg-[#1a2d5a]">
                        <QrCode className="h-4 w-4 mr-2" />
                        Scanner QR Code
                      </Button>
                    </Link>
                  )}
                  {course.status === "missed" && (
                    <Button variant="outline" size="sm" disabled>
                      Cours manqué
                    </Button>
                  )}
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
              Scanner un QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Scannez le QR Code affiché par votre professeur pour signer votre présence.
            </p>
            <Link href="/dashboard/student/scan">
              <Button className="w-full bg-[#2B468B] hover:bg-[#1a2d5a]">
                <QrCode className="h-4 w-4 mr-2" />
                Ouvrir le scanner
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSignature className="h-5 w-5 mr-2 text-[#2B468B]" />
              Mes signatures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Consultez l&apos;historique de toutes vos signatures et présences.</p>
            <Link href="/dashboard/student/signatures">
              <Button variant="outline" className="w-full">
                Voir mes signatures
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Historique des signatures récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSignature className="h-5 w-5 mr-2 text-[#2B468B]" />
            Signatures récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSignatures.map((signature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getSignatureStatusIcon(signature.status)}
                  <div>
                    <p className="font-medium text-gray-900">{signature.course?.name}</p>
                    <p className="text-sm text-gray-500">
                      {signature.signedAt
                        ? `${new Date(signature.signedAt).toLocaleDateString()} à ${new Date(signature.signedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Date inconnue"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    signature.status === "PRESENT"
                      ? "bg-green-100 text-green-800"
                      : signature.status === "LATE"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {signature.status === "PRESENT" ? "Présent" : signature.status === "LATE" ? "Retard" : "Absent"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
