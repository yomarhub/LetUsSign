"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useAlerts } from "@/hooks/useAlerts"

export function Header() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const { alerts, unreadCount, markAsRead, markAllAsRead } = useAlerts()

  if (!user) return null

  // Déterminer le titre de la page en fonction du chemin
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    const titleMap: { [key: string]: string } = {
      admin: "Tableau de bord Administrateur",
      professor: "Tableau de bord Professeur",
      student: "Tableau de bord Élève",
      users: "Gestion des utilisateurs",
      establishments: "Gestion des établissements",
      classes: "Gestion des classes",
      subjects: "Gestion des matières",
      courses: "Gestion des cours",
      attendance: "Gestion des présences",
      qrcodes: "Codes QR et accès",
      signatures: "Mes signatures",
      schedule: "Planning",
      scan: "Scanner QR Code",
      reports: "Rapports et statistiques",
      alerts: "Alertes et notifications",
      audit: "Journal d'audit",
      settings: "Paramètres",
    }

    return titleMap[lastSegment] || "Tableau de bord"
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Titre et salutation */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-600">
              {getTimeGreeting()}, {user.firstName} ! 👋
            </p>
          </div>

          {/* Actions de droite */}
          <div className="flex items-center space-x-4">
            {/* Barre de recherche */}
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-10 h-10 border-gray-300 focus:border-[#2B468B] focus:ring-[#2B468B]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="secondary">{unreadCount} nouvelles</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {alerts.slice(0, 5).map((alert) => (
                    <DropdownMenuItem
                      key={alert.id}
                      className="py-3 cursor-pointer"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${alert.isRead
                              ? "bg-gray-300"
                              : alert.severity === "HIGH"
                                ? "bg-red-500"
                                : alert.severity === "MEDIUM"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                            }`}
                        ></div>
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-gray-500">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(alert.createdAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-[#2B468B] font-medium" onClick={markAllAsRead}>
                  Marquer tout comme lu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#2B468B] text-white text-sm font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 font-normal">{user.establishment?.name}</p>
                    {user.class?.name && <p className="text-xs text-gray-500 font-normal">{user.class.name}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Aide et support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
