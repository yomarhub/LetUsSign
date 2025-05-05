"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileSignature,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Building,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  UserCheck,
  School,
  AlertTriangle,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  if (!user) return null

  const adminLinks = [
    { name: "Tableau de bord", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Utilisateurs", href: "/dashboard/admin/users", icon: Users },
    { name: "Classes", href: "/dashboard/admin/classes", icon: School },
    { name: "Matières", href: "/dashboard/admin/subjects", icon: GraduationCap },
    { name: "Cours", href: "/dashboard/admin/courses", icon: BookOpen },
    { name: "Présences", href: "/dashboard/admin/attendance", icon: UserCheck },
    { name: "Rapports", href: "/dashboard/admin/reports", icon: BarChart3 },
    { name: "Alertes", href: "/dashboard/admin/alerts", icon: AlertTriangle },
    { name: "Audit", href: "/dashboard/admin/audit", icon: ClipboardCheck },
    { name: "Paramètres", href: "/dashboard/admin/settings", icon: Settings },
  ]

  const professorLinks = [
    { name: "Tableau de bord", href: "/dashboard/professor", icon: LayoutDashboard },
    { name: "Mes cours", href: "/dashboard/professor/courses", icon: BookOpen },
    { name: "Présences", href: "/dashboard/professor/attendance", icon: ClipboardCheck },
    { name: "QR Codes", href: "/dashboard/professor/qrcodes", icon: QrCode },
    { name: "Planning", href: "/dashboard/professor/schedule", icon: Calendar },
    { name: "Rapports", href: "/dashboard/professor/reports", icon: BarChart3 },
    { name: "Paramètres", href: "/dashboard/professor/settings", icon: Settings },
  ]

  const studentLinks = [
    { name: "Tableau de bord", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Mes cours", href: "/dashboard/student/courses", icon: BookOpen },
    { name: "Scanner QR", href: "/dashboard/student/scan", icon: Camera },
    { name: "Mes signatures", href: "/dashboard/student/signatures", icon: FileSignature },
    { name: "Planning", href: "/dashboard/student/schedule", icon: Calendar },
    { name: "Paramètres", href: "/dashboard/student/settings", icon: Settings },
  ]

  const links = user.role === "ADMIN" ? adminLinks : user.role === "PROFESSOR" ? professorLinks : studentLinks

  const getRoleBadge = () => {
    type RoleKey = "admin" | "professor" | "student";
    const roleConfig: Record<RoleKey, { label: string; color: string }> = {
      admin: { label: "Admin", color: "bg-purple-100 text-purple-800" },
      professor: { label: "Professeur", color: "bg-blue-100 text-blue-800" },
      student: { label: "Élève", color: "bg-green-100 text-green-800" },
    }

    const roleKey = user.role.toLowerCase() as RoleKey;
    const config = roleConfig[roleKey];
    return <Badge className={`${config.color} text-xs`}>{config.label}</Badge>
  }

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={cn("transition-all duration-300", collapsed ? "hidden" : "block")}>
            <h1 className="font-bold text-xl text-[#2B468B]">LetUsSign</h1>
            <p className="text-xs text-gray-500 mt-1">Écoles de Lyon</p>
          </div>
          <div className={cn("transition-all duration-300", collapsed ? "block" : "hidden")}>
            <h1 className="font-bold text-lg text-[#2B468B]">LUS</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2B468B] rounded-full flex items-center justify-center text-white font-semibold">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.establishment?.name}</p>
                {user.class?.name && <p className="text-xs text-gray-500">{user.class.name}</p>}
              </div>
            </div>
            <div className="mt-2">{getRoleBadge()}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 flex flex-col justify-between">
        <nav className="px-3 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-[#2B468B] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#2B468B]",
                  collapsed ? "justify-center" : "justify-start",
                )}
              >
                <link.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    collapsed ? "mr-0" : "mr-3",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#2B468B]",
                  )}
                />
                {!collapsed && <span className="font-medium">{link.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 mb-6">
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
              collapsed ? "justify-center" : "justify-start",
            )}
          >
            <LogOut className={cn("h-5 w-5 transition-colors", collapsed ? "mr-0" : "mr-3")} />
            {!collapsed && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
