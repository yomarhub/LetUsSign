// Types pour l'API

// Types pour les établissements
export interface Establishment {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  phone?: string
  email?: string
  createdAt: string
  updatedAt: string
}

// Types pour les classes
export interface Class {
  id: string
  name: string
  level: string
  establishmentId: string
  establishment?: Establishment
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "ADMIN" | "PROFESSOR" | "STUDENT"
  status: "ACTIVE" | "INACTIVE"
  establishmentId: string
  classId?: string
  establishment?: Establishment
  class?: Class
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  name: string
  subject: string
  professorId: string
  classId: string
  date: string
  startTime: string
  endTime: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  professor?: User
  class?: Class
  createdAt: string
  updatedAt: string
}

export interface Signature {
  id: string
  studentId: string
  courseId: string
  signatureData: string
  signedAt: string
  status: "PRESENT" | "LATE" | "ABSENT"
  ipAddress?: string
  userAgent?: string
  student?: User
  course?: Course
  createdAt: string
  updatedAt: string
}

export interface QRCode {
  id: string
  courseId: string
  code: string
  expiresAt: string
  isActive: boolean
  scansCount: number
  maxScans?: number
  course?: Course
  createdAt: string
  updatedAt: string
}

export interface Alert {
  id: string
  type: "ABSENCE" | "LATE" | "FREQUENT_ABSENCE" | "SYSTEM" | "SECURITY"
  title: string
  message: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  userId?: string
  courseId?: string
  isRead: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  user?: User
  course?: Course
  creator?: User
}

export interface Report {
  id: string
  type: "attendance" | "absence" | "late" | "summary"
  title: string
  description: string
  filters: Record<string, any>
  data: any
  generatedBy: string
  createdAt: string
  updatedAt: string
}

// Types pour l'authentification
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// Types pour les utilisateurs
export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "ADMIN" | "PROFESSOR" | "STUDENT"
  establishmentId: string
  classId?: string
}

// Types pour les cours
export interface CreateCourseRequest {
  name: string
  subject: string
  classId: string
  date: string
  startTime: string
  endTime: string
}

// Types pour les signatures
export interface SignatureRequest {
  courseId: string
  qrCode: string
  signatureData: string
  timestamp: string
}

// Types pour les QR codes
export interface GenerateQRRequest {
  courseId: string
  expiryMinutes?: number
  maxScans?: number
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types pour les statistiques
export interface AdminStats {
  totalUsers: number
  activeCourses: number
  todaySignatures: number
  absences: number
  establishments: number
  classes: number
}

export interface ProfessorStats {
  todayCourses: number
  totalStudents: number
  presentStudents: number
  activeQRCodes: number
  lateStudents: number
}

export interface StudentStats {
  todayCourses: number
  attendanceRate: number
  totalSignatures: number
  lateCount: number
  upcomingCourses: number
}
