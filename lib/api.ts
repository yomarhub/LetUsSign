// Configuration de base pour les appels API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

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

// Classe pour gérer les erreurs API
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Fonction utilitaire pour les appels API
export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("letussign_token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Token expiré ou invalide
      if (response.status === 401) {
        localStorage.removeItem("letussign_token")
        localStorage.removeItem("letussign_user")
        window.location.href = "/"
      }

      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`, errorData.code)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Erreur réseau ou autre
    throw new ApiError(0, "Erreur de connexion au serveur")
  }
}

// Méthodes HTTP simplifiées
export const api = {
  get: <T = any>(endpoint: string) => apiCall<T>(endpoint),

  post: <T = any>(endpoint: string, data?: any) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiCall<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any) =>
    apiCall<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string) => apiCall<T>(endpoint, { method: "DELETE" }),
}

// Upload de fichiers (pour les signatures)
export async function uploadFile(
  endpoint: string,
  file: File | Blob,
  additionalData?: Record<string, any>,
): Promise<ApiResponse> {
  const token = localStorage.getItem("letussign_token")
  const formData = new FormData()

  formData.append("file", file)

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === "string" ? value : JSON.stringify(value))
    })
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}
