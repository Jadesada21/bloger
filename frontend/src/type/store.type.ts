

export interface User {
    id: number
    username: string
    password: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    logout: () => void
}