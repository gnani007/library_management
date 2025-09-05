import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { User, Books } from '../types'
import { bookServices } from '../services/bookServices'

type AuthState = {
  user: User | null
  token: string | null
}

type Action =
  | { type: 'LOGIN_AS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }

const initialState: AuthState = {
  user: null,
  token: null,
}

type User = {
  id: string
  name: string
  role: string
  borrowedBooks: string[]
}


function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN_AS':
      return { ...state, user: action.payload.user, token: action.payload.token }
    case 'LOGOUT':
      return { user: null, token: null }
    case 'SET_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

type AuthContextType = {
  state: AuthState
  loginAs: (which: 'user' | 'admin') => void
  logout: () => void
  setUser: (user: User) => void
  borrowBook: (bookId: string) => Promise<{ book: Books; user: User }>
  returnBook: (bookId: string) => Promise<{ book: Books; user: User }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const loginAs = (which: 'user' | 'admin') => {
    if (which === 'admin') {
      dispatch({
        type: 'LOGIN_AS',
        payload: {
          user: { id: 'A100', name: 'Gnan', role: 'admin', borrowedBooks: [] },
          token: 'admintoken',
        },
      })
    } else {
      dispatch({
        type: 'LOGIN_AS',
        payload: {
          user: { id: 'U100', name: 'Brahmisha', role: 'user', borrowedBooks: [] },
          token: 'usertoken',
        },
      })
    }
  }

  const logout = () => dispatch({ type: 'LOGOUT' })

  const setUser = (user: User) => dispatch({ type: 'SET_USER', payload: user })

  // call backend, update context user with returned user
  const borrowBook = async (bookId: string) => {
    if (!state.user) throw new Error('Not authenticated')
    // bookServices.borrowBook returns { book, user } (as your backend does)
    const res = await bookServices.borrowBook(state.user.id, bookId)
    if (res && res.user) setUser(res.user)
    return res
  }

  const returnBook = async (bookId: string) => {
    if (!state.user) throw new Error('Not authenticated')
    const res = await bookServices.returnBook(state.user.id, bookId)
    if (res && res.user) setUser(res.user)
    return res
  }

  return (
    <AuthContext.Provider value={{ state, loginAs, logout, setUser, borrowBook, returnBook }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
