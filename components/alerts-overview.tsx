"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"

type Alert = {
  id: string
  type: "absence" | "late" | "system" | "security"
  title: string
  description: string
  timestamp: string
  severity: "low" | "medium" | "high"
  status: "new" | "acknowledged" | "resolved"
  actionTaken?: string
}

export function AlertsOverview() {
  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      type: "absence",
      title: "Absences multiples détectées",
      description: "5 élèves absents en cours de Mathématiques - Emails envoyés automatiquement",
      timestamp: "Il y a 15 minutes",
      severity: "medium",
      status: "new",
    },
    {
      id: "2",
      type: "late",
      title: "Retards fréquents",
      description: "Lucas Bernard accumule 3 retards cette semaine",
      timestamp: "Il y a 1 heure",
      severity: "low",
      status: "acknowledged",
    },
    {
      id: "3",
      type: "system",
      title: "QR Code expiré",
      description: "Le QR Code du cours de Physique a expiré sans signatures",
      timestamp: "Il y a 2 heures",
      severity: "medium",
      status: "resolved",
      actionTaken: "Nouveau QR Code généré",
    },
    {
      id: "4",
      type: "security",
      title: "Tentative de connexion suspecte",
      description: "Plusieurs tentatives de connexion échouées pour admin@letussign.fr",
      timestamp: "Il y a 3 heures",
      severity: "high",
      status: "new",
    },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "acknowledged":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "absence":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "system":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "security":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {getTypeIcon(alert.type)}
            {getStatusIcon(alert.status)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900 truncate">{alert.title}</h4>
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity === "high" ? "Critique" : alert.severity === "medium" ? "Moyen" : "Faible"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{alert.timestamp}</p>
              {alert.status === "new" && (
                <Button size="sm" variant="outline" className="text-xs">
                  Marquer comme lu
                </Button>
              )}
              {alert.actionTaken && <p className="text-xs text-green-600 font-medium">✓ {alert.actionTaken}</p>}
            </div>
          </div>
        </div>
      ))}

      <div className="text-center pt-4 border-t">
        <Button variant="outline" className="text-[#2B468B]">
          Voir toutes les alertes
        </Button>
      </div>
    </div>
  )
}
