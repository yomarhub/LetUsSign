"use client"

import type { Class } from "@/types/api"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClassModalProps {
    isOpen: boolean
    onClose: () => void
    classData: Class | null
}

export function ClassModal({ isOpen, onClose, classData }: ClassModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        level: "",
    })

    useEffect(() => {
        if (classData) {
            setFormData({
                name: classData.name,
                level: classData.level,
            })
        } else {
            setFormData({
                name: "",
                level: "",
            })
        }
    }, [classData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Logique pour sauvegarder la classe
        console.log("Données classe:", formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{classData ? "Modifier la classe" : "Ajouter une classe"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de la classe</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="level">Niveau</Label>
                        <Input id="level" name="level" value={formData.level} onChange={handleChange} required />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-[#2B468B] hover:bg-[#1a2d5a]">
                            {classData ? "Mettre à jour" : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
