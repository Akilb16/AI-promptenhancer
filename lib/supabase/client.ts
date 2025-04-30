"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Check if we're in a preview environment
const isPreview =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost")

// Create a client with error handling
export const createClient = () => {
  if (isPreview) {
    return createMockClient()
  }

  try {
    return createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Mock client for preview environments
function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async ({ email }: { email: string }) => {
        // Simulate successful login with demo@example.com
        if (email === "demo@example.com") {
          return {
            data: {
              user: {
                id: "demo-user-id",
                email: "demo@example.com",
              },
              session: {
                access_token: "mock-token",
                refresh_token: "mock-refresh-token",
                expires_at: Date.now() + 3600,
                user: {
                  id: "demo-user-id",
                  email: "demo@example.com",
                },
              },
            },
            error: null,
          }
        }
        // Simulate failed login
        return {
          data: { user: null, session: null },
          error: new Error("Invalid login credentials"),
        }
      },
      signUp: async ({ email }: { email: string }) => {
        return {
          data: {
            user: {
              id: "new-user-id",
              email,
            },
            session: null,
          },
          error: null,
        }
      },
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({
            data: [],
            error: null,
          }),
        }),
        order: () => ({
          data: [],
          error: null,
        }),
      }),
      insert: () => ({
        select: async () => ({ data: [{ id: "mock-id" }], error: null }),
      }),
      update: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  } as any
}
