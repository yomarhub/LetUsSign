"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { SignatureService } from "@/services/signature.service"
import type { Signature, SignatureRequest } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

export function useSignatures(params?: {
  page?: number
  limit?: number
  studentId?: string
  courseId?: string
  date?: string
  status?: string
}) {
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSignatures = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await SignatureService.getSignatures(params)
      setSignatures(response.data || [])
      setPagination(response.pagination)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les signatures",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSignatures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.limit, params?.studentId, params?.courseId, params?.date, params?.status])

  const signAttendance = async (signatureData: SignatureRequest): Promise<Signature> => {
    try {
      const newSignature = await SignatureService.signAttendance(signatureData)
      setSignatures((prev) => [newSignature, ...prev])
      toast({
        title: "Succès",
        description: "Présence signée avec succès",
      })
      return newSignature
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la signature",
        variant: "destructive",
      })
      throw err
    }
  }

  const markAttendance = async (
    courseId: string,
    studentId: string,
    status: "present" | "absent" | "late",
  ): Promise<Signature> => {
    try {
      const signature = await SignatureService.markAttendance(courseId, studentId, status)
      setSignatures((prev) => {
        const existing = prev.find((s) => s.courseId === courseId && s.studentId === studentId)
        if (existing) {
          return prev.map((s) => (s.id === existing.id ? signature : s))
        }
        return [signature, ...prev]
      })
      toast({
        title: "Succès",
        description: "Présence marquée avec succès",
      })
      return signature
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors du marquage",
        variant: "destructive",
      })
      throw err
    }
  }

  return {
    signatures,
    pagination,
    isLoading,
    error,
    refetch: fetchSignatures,
    signAttendance,
    markAttendance,
  }
}

// Hook pour les signatures d'un étudiant
export function useStudentSignatures(
  studentId: string,
  params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  },
) {
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedParams = useMemo(() => params, [
    params?.page,
    params?.limit,
    params?.startDate,
    params?.endDate,
  ])

  const fetchStudentSignatures = useCallback(async () => {
    if (!studentId) return
    try {
      setIsLoading(true)
      setError(null)
      const response = await SignatureService.getStudentSignatures(studentId, memoizedParams)
      setSignatures(response.data || [])
      setPagination(response.pagination)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [studentId, memoizedParams])

  useEffect(() => {
    fetchStudentSignatures()
  }, [fetchStudentSignatures])

  return { signatures, pagination, isLoading, error, refetch: fetchStudentSignatures }
}

// Hook pour les présences d'un cours
export function useCourseAttendance(courseId: string) {
  const [attendance, setAttendance] = useState<{
    signatures: Signature[]
    stats: {
      totalStudents: number
      presentCount: number
      absentCount: number
      lateCount: number
      attendanceRate: number
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await SignatureService.getCourseAttendance(courseId)
      setAttendance(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (courseId) {
      fetchAttendance()
    }
  }, [courseId, fetchAttendance])

  return { attendance, isLoading, error, refetch: fetchAttendance }
}
