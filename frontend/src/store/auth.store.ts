import { create } from 'zustand'
import type { AuthState } from '../type/store.type'

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false
        })
}))