"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Building, GraduationCap, BarChart3, Settings, UserPlus, School, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Nouvel utilisateur",
      description: "Ajouter un élève, professeur ou admin",
      icon: UserPlus,
      href: "/dashboard/admin/users",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Nouveau cours",
      description: "Créer un nouveau cours",
      icon: BookOpen,
      href: "/dashboard/admin/courses",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Nouvel établissement",
      description: "Ajouter un établissement",
      icon: Building,
      href: "/dashboard/admin/establishments",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Nouvelle classe",
      description: "Créer une classe",
      icon: School,
      href: "/dashboard/admin/classes",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Nouvelle matière",
      description: "Créer une matière",
      icon: GraduationCap,
      href: "/dashboard/admin/subjects",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Générer rapport",
      description: "Créer un rapport personnalisé",
      icon: FileText,
      href: "/dashboard/admin/reports",
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      title: "Voir statistiques",
      description: "Consulter les rapports détaillés",
      icon: BarChart3,
      href: "/dashboard/admin/reports",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      title: "Paramètres système",
      description: "Configuration générale",
      icon: Settings,
      href: "/dashboard/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#2B468B]" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-3 hover:shadow-md transition-all duration-200 w-full group"
              >
                <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-[#2B468B] transition-colors">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
