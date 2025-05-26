"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { QrCode, Clock, Users, Copy, RefreshCw } from "lucide-react"
import { QRCodeGenerator } from "@/components/qr-code-generator"

import { QRCodeService } from "@/services/qrcode.service"
import { CourseService } from "@/services/course.service"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import type { QRCode, Course } from "@/types/api"

export default function QRCodesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState("")
  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [activeQRCodes, setActiveQRCodes] = useState<QRCode[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseService.getCourses({
          professorId: user?.id,
          status: "scheduled",
        })
        setCourses(response.data || [])
      } catch (error) {
        console.error("Erreur lors du chargement des cours:", error)
      }
    }

    const fetchActiveQRCodes = async () => {
      try {
        const qrCodes = await QRCodeService.getActiveQRCodes(user?.id)
        setActiveQRCodes(qrCodes)
      } catch (error) {
        console.error("Erreur lors du chargement des QR codes:", error)
      }
    }

    if (user) {
      fetchCourses()
      fetchActiveQRCodes()
    }
  }, [user])

  const generateQRCode = async () => {
    if (!selectedCourse) return

    setIsGenerating(true)
    try {
      const qrCode = await QRCodeService.generateQRCode({
        courseId: selectedCourse,
        expiryMinutes: 120,
      })

      setActiveQRCode(qrCode)
      setActiveQRCodes((prev) => [qrCode, ...prev])

      toast({
        title: "Succès",
        description: "QR Code généré avec succès",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Afficher une notification de succès
  }

  const regenerateCode = (qrCodeId: string) => {
    // Logique pour régénérer un code
    generateQRCode()
  }

  return (
    <div className="space-y-6">
      {/* Générateur de QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-6 w-6 mr-2 text-[#2B468B]" />
            Générer un QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sélectionner un cours</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {course.class?.name ?? "Unknown Class"} ({course.startTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateQRCode}
                disabled={!selectedCourse || isGenerating}
                className="w-full bg-[#2B468B] hover:bg-[#1a2d5a]"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </div>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Générer le QR Code
                  </>
                )}
              </Button>
            </div>

            {activeQRCode && (
              <div className="flex justify-center">
                <QRCodeGenerator value={activeQRCode.code} size={200} />
              </div>
            )}
          </div>

          {activeQRCode && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Code d&apos;accès</p>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="font-mono font-bold text-lg">{activeQRCode.code}</p>
                    <Button variant="ghost" size="icon" onClick={() => copyCode(activeQRCode.code)} className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Créé à</p>
                  <p className="font-semibold">{activeQRCode.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expire à</p>
                  <p className="font-semibold">{activeQRCode.expiresAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scans</p>
                  <p className="font-semibold">
                    {activeQRCode.scansCount}/{activeQRCode.maxScans ?? activeQRCode.scansCount}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Codes actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#2B468B]" />
              QR Codes actifs
            </span>
            <Badge variant="outline">
              {activeQRCodes.length} actif{activeQRCodes.length > 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeQRCodes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun QR Code actif</p>
              <p className="text-sm">Générez un QR Code pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeQRCodes.map((qr) => (
                <div key={qr.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{qr.course?.name}</h3>
                      <p className="text-sm text-gray-500">
                        Code: <span className="font-mono font-bold">{qr.code}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => regenerateCode(qr.id)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Régénérer
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyCode(qr.code)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copier
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Expire à</span>
                      </div>
                      <p className="font-semibold">{qr.expiresAt}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Signatures</span>
                      </div>
                      <p className="font-semibold">
                        {qr.scansCount}/{qr.maxScans}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1">
                        <QrCode className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Taux</span>
                      </div>
                      <p className="font-semibold">{Math.round((qr.scansCount / (qr.maxScans ?? qr.scansCount)) * 100)}%</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2B468B] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(qr.scansCount / (qr.maxScans ?? qr.scansCount)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions d&apos;utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#2B468B] text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p>Sélectionnez le cours pour lequel vous voulez générer un QR Code</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#2B468B] text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p>Cliquez sur &quot;Générer le QR Code&quot; pour créer un code unique</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#2B468B] text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p>Affichez le QR Code à vos élèves ou donnez-leur le code d&apos;accès</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#2B468B] text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <p>Les élèves scannent le code ou le saisissent pour signer leur présence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
