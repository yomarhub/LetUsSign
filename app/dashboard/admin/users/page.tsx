"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Edit, Trash, Download, Filter } from "lucide-react"
import { UserModal } from "@/components/user-modal"
import { UserService } from "@/services/user.service"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types/api"
import { AuthService } from "@/services/auth.service"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "INACTIVE" | null>(null)
  const { toast } = useToast()


  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await UserService.getUsers({ search: searchQuery })
      setUsers(response.data || [])
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers, searchQuery])

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await UserService.deleteUser(userId)
      fetchUsers() // Re-fetch users after deletion
      // setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      case "PROFESSOR":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Professeur</Badge>
      case "STUDENT":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Étudiant</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>
    )
  }

  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase()
    if (statusFilter && user.status !== statusFilter) {
      return false
    }
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    )
  })

  const isCurrentUser = (user: User) => user.id === AuthService.getCurrentUser()?.id

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter(null)}
                className={!statusFilter ? "bg-gray-100" : ""}
              >
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("ACTIVE")}
                className={statusFilter === "ACTIVE" ? "bg-green-100" : undefined}
              >
                Actif
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("INACTIVE")}
                className={statusFilter === "INACTIVE" ? "bg-gray-200" : ""}
              >
                Inactif
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddUser} className="bg-[#2B468B] hover:bg-[#1a2d5a]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className={isCurrentUser(user) ? "bg-blue-50 hover:bg-blue-100" : undefined}
              >
                <TableCell className="font-medium">
                  {user.lastName} {user.firstName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isCurrentUser(user)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchUsers() }} user={selectedUser} />
    </div >
  )
}
