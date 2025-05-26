"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Camera, Type, CheckCircle, AlertCircle } from "lucide-react"
import { SignatureCanvas } from "@/components/signature-canvas"
import { QRCodeService } from "@/services/qrcode.service"
import { SignatureService } from "@/services/signature.service"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import type { SignatureRequest } from "@/types/api"

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<"qr" | "code">("qr")
  const [manualCode, setManualCode] = useState("")
  const [courseFound, setCourseFound] = useState<any>(null)
  const [showSignature, setShowSignature] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  useEffect(() => {
    if (scanMode === "qr") {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [scanMode, stopCamera])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error)
    }
  }

  const handleCodeSubmit = async (code: string) => {
    setIsLoading(true)

    try {
      const validation = await QRCodeService.validateQRCode(code)

      if (validation.valid && validation.course) {
        setCourseFound(validation.course)
        setShowSignature(true)
      } else {
        toast({
          title: "Code invalide",
          description: validation.message || "Ce code n'est pas valide ou a expiré",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la validation du code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      handleCodeSubmit(manualCode.trim())
    }
  }

  const handleSignatureComplete = async (signatureData: string) => {
    if (!courseFound || !user) return

    try {
      const signatureRequest: SignatureRequest = {
        courseId: courseFound.id,
        qrCode: manualCode,
        signatureData,
        timestamp: new Date().toISOString(),
      }

      await SignatureService.signAttendance(signatureRequest)

      toast({
        title: "Succès",
        description: "Présence signée avec succès !",
      })

      // Réinitialiser l'état
      setCourseFound(null)
      setShowSignature(false)
      setManualCode("")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la signature",
        variant: "destructive",
      })
    }
  }

  if (showSignature && courseFound) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              Cours trouvé !
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">{courseFound.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Professeur:</span> {courseFound.professor}
                </div>
                <div>
                  <span className="font-medium">Horaire:</span> {courseFound.time}
                </div>
                <div>
                  <span className="font-medium">Salle:</span> {courseFound.room}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <SignatureCanvas onComplete={handleSignatureComplete} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-6 w-6 mr-2 text-[#2B468B]" />
            Scanner pour signer sa présence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Mode de scan */}
            <div className="flex space-x-4">
              <Button
                variant={scanMode === "qr" ? "default" : "outline"}
                onClick={() => setScanMode("qr")}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scanner QR Code
              </Button>
              <Button
                variant={scanMode === "code" ? "default" : "outline"}
                onClick={() => setScanMode("code")}
                className="flex-1"
              >
                <Type className="h-4 w-4 mr-2" />
                Code manuel
              </Button>
            </div>

            {/* Scanner QR */}
            {scanMode === "qr" && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-2 border-white/50 rounded-lg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#2B468B] rounded-lg"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Pointez votre caméra vers le QR Code affiché par votre professeur
                </p>
              </div>
            )}

            {/* Code manuel */}
            {scanMode === "code" && (
              <form onSubmit={handleManualCodeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Code du cours</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Entrez le code donné par votre professeur"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-mono"
                    maxLength={10}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#2B468B] hover:bg-[#1a2d5a]"
                  disabled={!manualCode.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </div>
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
              </form>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Instructions :</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Demandez le QR Code ou le code d&apos;accès à votre professeur</li>
                    <li>Scannez le QR Code ou saisissez le code manuellement</li>
                    <li>Signez votre présence avec votre doigt ou stylet</li>
                    <li>Votre présence sera automatiquement enregistrée</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
