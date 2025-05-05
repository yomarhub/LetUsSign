"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/types/api"
import { api } from "@/lib/api"
import { AuthService } from "@/services/auth.service"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
    status: "ACTIVE",
    password: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        password: "", // Le mot de passe n'est pas rempli lors de l'édition
      })
    } else {
      // Réinitialiser le formulaire pour un nouvel utilisateur
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "student",
        status: "active",
        password: "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return // Validation basique, vous pouvez améliorer selon vos besoins
    }
    try {
      if (!user) {
        // Création d'un nouvel utilisateur
        await api.post("/users", {
          ...formData,
          role: formData.role.toUpperCase(),
          status: formData.status.toUpperCase(),
        })
        console.log("Nouvel utilisateur créé avec succès")
        onClose()
      } else {
        // Mise à jour d'un utilisateur existant
        await api.put(`/users/${user.id}`, {
          ...formData,
          role: formData.role.toUpperCase(),
          status: formData.status.toUpperCase(),
        })
        console.log("Utilisateur sauvegardé avec succès")
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error)
      // Gérer l'erreur si besoin
    }
    // Pour l'exemple, on log les données
    // Logique pour sauvegarder l'utilisateur
    console.log("Données utilisateur:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role.toLowerCase()} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="professor">Professeur</SelectItem>
                  <SelectItem value="student">Étudiant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status.toLowerCase()} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#2B468B] hover:bg-[#1a2d5a]">
              {user ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
