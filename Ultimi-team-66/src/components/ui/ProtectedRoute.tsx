'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface User {
  name: string
  email: string
  avatarUrl?: string
}

interface ProtectedRouteProps {
  children: ReactNode
}

// Create context to provide user
const UserContext = createContext<User | null>(null)

export const useUser = () => useContext(UserContext)

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/') // redirect if not logged in
      } else {
        setUser({
          name: data?.user?.user_metadata?.full_name || 'User',
          email: data?.user?.user_metadata?.email,
          avatarUrl: data.user.user_metadata?.avatar_url || undefined,
        })
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <></>
    )
  }

  if (!user) return null

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
