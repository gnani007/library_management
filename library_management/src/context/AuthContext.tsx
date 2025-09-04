import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '../types'

// Simple auth context with mocked tokens and roles.
// In a real app, tokens would be from an auth provider.
type AuthState = {
  user: User | null
  token: string | null
}

type AuthContextType = {
  state: AuthState
  loginAs: (which: 'user' | 'admin') => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null, token: null })

  const loginAs = (which: 'user' | 'admin') => {
    if (which === 'admin') {
      setState({ user: { id: 'a1', name: 'Gnan', role: 'admin', borrowedBooks: [] }, token: 'admintoken' })
    } else {
      setState({ user: { id: 'u1', name: 'Brahmisha', role: 'user', borrowedBooks: [] }, token: 'usertoken' })
    }
  }

  const logout = () => setState({ user: null, token: null })

  return (
    <AuthContext.Provider value={{ state, loginAs, logout }
    }> {children} </AuthContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
