
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUserRequest } from '@/modules/auth/actions'
import type { RootState } from '@/modules/rootReducer'

interface User {
  id: string
  email: string
  name?: string
  role: string
  balance: number
}

interface AuthContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  refresh: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user as User | null)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const [bootstrapped, setBootstrapped] = useState(false)

  const refresh = async () => {
    dispatch(getCurrentUserRequest())
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('token')

    if (oauthToken) {
      localStorage.setItem('authToken', oauthToken)
      window.history.replaceState({}, '', window.location.pathname)
    }

    const token = localStorage.getItem('authToken')
    const expiry = localStorage.getItem('tokenExpiry')
    if (token && expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('tokenExpiry')
    } else if (token) {
      dispatch(getCurrentUserRequest())
    }
 

    setBootstrapped(true)
  }, [dispatch])

  const status = !bootstrapped || loading ? 'loading' : user ? 'authenticated' : 'unauthenticated'

  return (
    <AuthContext.Provider value={{ user, status, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
