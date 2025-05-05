"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

type Signature = {
  id: string
  studentName: string
  studentInitials: string
  course: string
  professor: string
  date: string
  time: string
  status: "present" | "absent" | "late"
  signatureType: "qr" | "manual" | "digital"
  establishment: string
}

export function RecentSignatures() {
  const [signatures] = useState<Signature[]>([
    {
      id: "1",
      studentName: "Lucas Bernard",
      studentInitials: "LB",
      course: "Mathématiques",
      professor: "M. Martin",
      date: "31/05/2025",
      time: "09:15",
      status: "present",
      signatureType: "qr",
      establishment: "Lycée Jean Moulin",
    },
    {
      id: "2",
      studentName: "Marie Dubois",
      studentInitials: "MD",
      course: "Anglais",
      professor: "Mme. Petit",
      date: "31/05/2025",
      time: "10:30",
      status: "absent",
      signatureType: "manual",
      establishment: "Lycée Jean Moulin",
    },
    {
      id: "3",
      studentName: "Thomas Leroy",
      studentInitials: "TL",
      course: "Physique",
      professor: "M. Durand",
      date: "31/05/2025",
      time: "11:45",
      status: "late",
      signatureType: "digital",
      establishment: "Collège Victor Hugo",
    },
    {
      id: "4",
      studentName: "Sophie Martin",
      studentInitials: "SM",
      course: "Histoire",
      professor: "Mme. Rousseau",
      date: "31/05/2025",
      time: "13:00",
      status: "present",
      signatureType: "qr",
      establishment: "Lycée Ampère",
    },
    {
      id: "5",
      studentName: "Antoine Moreau",
      studentInitials: "AM",
      course: "Informatique",
      professor: "M. Garcia",
      date: "31/05/2025",
      time: "14:15",
      status: "present",
      signatureType: "digital",
      establishment: "École Pasteur",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Présent
          </Badge>
        )
      case "late":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Retard
          </Badge>
        )
      case "absent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Absent
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSignatureTypeBadge = (type: string) => {
    switch (type) {
      case "qr":
        return (
          <Badge variant="secondary" className="text-xs">
            QR Code
          </Badge>
        )
      case "digital":
        return (
          <Badge variant="secondary" className="text-xs">
            Signature
          </Badge>
        )
      case "manual":
        return (
          <Badge variant="secondary" className="text-xs">
            Manuel
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {type}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {signatures.map((signature) => (
        <div
          key={signature.id}
          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#2B468B] text-white text-sm font-semibold">
                {signature.studentInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{signature.studentName}</p>
              <p className="text-sm text-gray-600">{signature.course}</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-gray-500">{signature.professor}</p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">{signature.establishment}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{signature.date}</p>
              <p className="text-xs text-gray-500">{signature.time}</p>
              <div className="mt-1">{getSignatureTypeBadge(signature.signatureType)}</div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(signature.status)}
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center pt-4 border-t">
        <Button variant="outline" className="text-[#2B468B]">
          Voir toutes les signatures
        </Button>
      </div>
    </div>
  )
}
