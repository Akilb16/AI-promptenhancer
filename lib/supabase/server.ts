import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Check if we're in a preview environment
const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

export const createClient = () => {
  if (isPreview) {
    return createMockClient()
  }

  try {
    const cookieStore = cookies()
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return createMockClient()
  }
}

// Mock client for preview environments
function createMockClient() {
  return {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: "demo-user-id",
              email: "demo@example.com",
            },
          },
        },
        error: null,
      }),
      getUser: async () => ({
        data: {
          user: {
            id: "demo-user-id",
            email: "demo@example.com",
          },
        },
        error: null,
      }),
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
