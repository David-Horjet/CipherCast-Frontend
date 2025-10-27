const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.swiv.xyz"

export interface RegisterUserRequest {
  walletAddress: string
  authMethod: string
  authIdentifier: string
  privyUserId: string
  username?: string
  email?: string
  avatarUrl?: string
  isEmailVerified?: boolean
}

export interface LoginUserRequest {
  walletAddress: string
  privyUserId: string
}

export interface UpdateProfileRequest {
  username?: string
  avatarUrl?: string
}

export interface UserProfile {
  id: string
  walletAddress: string
  authMethod: string
  username?: string
  email?: string
  avatarUrl?: string
  isEmailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export const authApi = {
  async register(data: RegisterUserRequest): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`)
    }

    return response.json()
  },

  async login(data: LoginUserRequest): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`)
    }

    return response.json()
  },

  async getProfile(walletAddress: string): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/api/users/${walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`)
    }

    return response.json()
  },

  async updateProfile(walletAddress: string, data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/api/users/${walletAddress}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`)
    }

    return response.json()
  },
}
