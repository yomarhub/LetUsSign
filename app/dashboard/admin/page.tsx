"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  FileSignature,
  AlertTriangle,
  Building,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import { AttendanceChart } from "@/components/attendance-chart"
import { RecentSignatures } from "@/components/recent-signatures"
import { QuickActions } from "@/components/quick-actions"
import { AlertsOverview } from "@/components/alerts-overview"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useCourses } from "@/hooks/useCourses"
import { useSignatures } from "@/hooks/useSignatures"
import { api } from "@/lib/api"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { courses } = useCourses({ limit: 5 })
  const { signatures } = useSignatures({ limit: 10 })
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    todaySignatures: 0,
    absences: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats")
        if (response.success) {
          setStats(response.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">+15% ce mois</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">2,456 élèves • 387 profs • 4 admins</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Cours Actifs</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeCourses}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">+8 cette semaine</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Répartis sur 12 établissements</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Signatures Aujourd&apos;hui</CardTitle>
            <FileSignature className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.todaySignatures}</div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600 font-medium">96.8% de présence</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Sur 1,275 attendues</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Absences</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.absences}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              <p className="text-xs text-orange-600 font-medium">12 retards</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Emails envoyés automatiquement</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <QuickActions />

      {/* Graphiques et données principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-[#2B468B]" />
              Taux de présence hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSignature className="h-5 w-5 mr-2 text-[#2B468B]" />
              Signatures récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSignatures />
          </CardContent>
        </Card>
      </div>

      {/* Alertes et établissements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Alertes et notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsOverview />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Building className="h-5 w-5 mr-2 text-[#2B468B]" />
              Établissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Lycée Jean Moulin</p>
                  <p className="text-xs text-gray-500">Lyon 3ème</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">98.2%</p>
                  <p className="text-xs text-gray-500">présence</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Collège Victor Hugo</p>
                  <p className="text-xs text-gray-500">Lyon 6ème</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">96.8%</p>
                  <p className="text-xs text-gray-500">présence</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">École Pasteur</p>
                  <p className="text-xs text-gray-500">Lyon 7ème</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-600">94.1%</p>
                  <p className="text-xs text-gray-500">présence</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Lycée Ampère</p>
                  <p className="text-xs text-gray-500">Lyon 2ème</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">97.5%</p>
                  <p className="text-xs text-gray-500">présence</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="h-5 w-5 mr-2 text-[#2B468B]" />
              Matières populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mathématiques</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-[#2B468B] h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-medium">42 cours</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Français</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-[#2B468B] h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <span className="text-sm font-medium">35 cours</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Anglais</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-[#2B468B] h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <span className="text-sm font-medium">30 cours</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sciences</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-[#2B468B] h-2 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                  <span className="text-sm font-medium">28 cours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-[#2B468B]" />
              Répartition des rôles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Élèves</span>
                  <span className="font-medium">2,456 (86.3%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "86.3%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Professeurs</span>
                  <span className="font-medium">387 (13.6%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "13.6%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Administrateurs</span>
                  <span className="font-medium">4 (0.1%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "0.1%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2 text-[#2B468B]" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Nouveau cours créé</p>
                  <p className="text-gray-500 text-xs">Physique - Terminale S2</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Utilisateur ajouté</p>
                  <p className="text-gray-500 text-xs">Prof. Sophie Martin</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Alerte absence</p>
                  <p className="text-gray-500 text-xs">5 élèves absents</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Rapport généré</p>
                  <p className="text-gray-500 text-xs">Présences mensuel</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
