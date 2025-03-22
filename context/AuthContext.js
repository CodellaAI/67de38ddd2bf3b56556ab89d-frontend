
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a token in cookies
    const token = Cookies.get('auth_token')
    if (token) {
      // Validate token and get user data
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser({ ...response.data, token })
        })
        .catch(error => {
          console.error('Authentication error:', error)
          Cookies.remove('auth_token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    // Set token in cookie (expires in 7 days)
    Cookies.set('auth_token', token, { expires: 7 })
    setUser({ ...userData, token })
  }

  const logout = () => {
    Cookies.remove('auth_token')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
