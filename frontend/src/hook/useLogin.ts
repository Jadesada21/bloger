import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: ({
            username,
            password,
        }: {
            username: string,
            password: string
        }) => loginApi(username, password),

        onSuccess: (data) => {
            setUser(data.user)
        }
    })
}   