"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { Alert } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<Alert[]>("/alerts")

      if (response.success && response.data) {
        setAlerts(response.data)
        setUnreadCount(response.data.filter((alert) => !alert.isRead).length)
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des alertes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (alertId: string) => {
    try {
      await api.patch(`/alerts/${alertId}/read`)
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'alerte comme lue",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch("/alerts/read-all")
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))
      setUnreadCount(0)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les alertes comme lues",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAlerts()

    // Polling pour les nouvelles alertes toutes les 30 secondes
    const interval = setInterval(fetchAlerts, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    alerts,
    unreadCount,
    isLoading,
    refetch: fetchAlerts,
    markAsRead,
    markAllAsRead,
  }
}
