"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Check if we're in a preview environment
const isPreview =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost")

// Define the user type
type User = {
  id: string
  email: string
  isDemo?: boolean
}

// Define the auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        if (isPreview) {
          // In preview mode, check if we have a demo user in session storage
          const demoUser = sessionStorage.getItem("demoUser")
          if (demoUser) {
            setUser(JSON.parse(demoUser))
          }
          setLoading(false)
          return
        }

        // In production, check Supabase auth
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth error:", error)
          setUser(null)
        } else if (data.session) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isPreview) {
        // In preview mode, create a demo user
        const demoUser = {
          id: "demo-user-id",
          email: email || "demo@example.com",
          isDemo: true,
        }
        setUser(demoUser)
        // Store in session storage
        sessionStorage.setItem("demoUser", JSON.stringify(demoUser))
        return
      }

      // In production, use Supabase auth
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
        })
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isPreview) {
        // In preview mode, create a demo user
        const demoUser = {
          id: "demo-user-id",
          email: email || "demo@example.com",
          isDemo: true,
        }
        setUser(demoUser)
        // Store in session storage
        sessionStorage.setItem("demoUser", JSON.stringify(demoUser))
        return
      }

      // In production, use Supabase auth
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
        })
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      if (isPreview) {
        // In preview mode, clear the demo user
        setUser(null)
        sessionStorage.removeItem("demoUser")
        return
      }

      // In production, use Supabase auth
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
