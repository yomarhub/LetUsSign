'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, MoreHorizontal, Edit, Trash, Download, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { api } from "@/lib/api";
import type { Class } from "@/types/api";
import { ClassModal } from '@/components/class-modal';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const router = useRouter();

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Class[]>("/admin/classes");
      setClasses(res.data || []);
    } catch (error) {
      // Gérer l'erreur si besoin
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classe: Class) => {
    setSelectedClass(classe);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId: string) => {
    // À implémenter selon votre logique
    setClasses(classes.filter((classe) => classe.id !== classId));
  };

  const filteredClasses = classes.filter((classe) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      classe.name.toLowerCase().includes(searchTerm) ||
      classe.level.toLowerCase().includes(searchTerm) ||
      (classe.establishment?.name?.toLowerCase() || "").includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une classe..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddClass} className="bg-[#2B468B] hover:bg-[#1a2d5a]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une classe
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Établissement</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((classe) => (
                <TableRow key={classe.id}>
                  <TableCell className="font-medium">{classe.name}</TableCell>
                  <TableCell>{classe.level}</TableCell>
                  <TableCell>{new Date(classe.createdAt).getFullYear()}</TableCell>
                  <TableCell>{classe.establishment?.name || classe.establishmentId}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClass(classe)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClass(classe.id)}
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
        )}
      </div>

      <ClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} classData={selectedClass} />
    </div>
  );
}
