"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Course } from "@/types/api"
import { getName } from "@/lib/utils"

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    professor: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    description: "",
  })

  // Liste simulée des professeurs et matières
  const professors = [
    { id: "1", name: "Pierre Bernard" },
    { id: "2", name: "Sophie Petit" },
    { id: "3", name: "Thomas Leroy" },
    { id: "4", name: "Marie Dubois" },
  ]

  const subjects = [
    { id: "1", name: "Mathématiques" },
    { id: "2", name: "Anglais" },
    { id: "3", name: "Physique" },
    { id: "4", name: "Histoire" },
    { id: "5", name: "Informatique" },
  ]

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        subject: course.subject,
        professor: getName(course.professor),
        date: course.date,
        startTime: course.startTime,
        endTime: course.endTime,
        status: course.status,
        description: "",
      })
    } else {
      // Réinitialiser le formulaire pour un nouveau cours
      setFormData({
        name: "",
        subject: "",
        professor: "",
        date: "",
        startTime: "",
        endTime: "",
        status: "scheduled",
        description: "",
      })
    }
  }, [course])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour sauvegarder le cours
    console.log("Données du cours:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{course ? "Modifier le cours" : "Ajouter un cours"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du cours</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Matière</Label>
              <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professor">Professeur</Label>
              <Select value={formData.professor} onValueChange={(value) => handleSelectChange("professor", value)}>
                <SelectTrigger id="professor">
                  <SelectValue placeholder="Sélectionner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.name}>
                      {professor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="text"
                placeholder="JJ/MM/AAAA"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                name="startTime"
                type="text"
                placeholder="HH:MM"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                name="endTime"
                type="text"
                placeholder="HH:MM"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Programmé</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#2B468B] hover:bg-[#1a2d5a]">
              {course ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
