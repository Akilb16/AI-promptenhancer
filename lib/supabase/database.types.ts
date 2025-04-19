export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          original_prompt: string
          enhanced_prompt: string | null
          context: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_prompt: string
          enhanced_prompt?: string | null
          context?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_prompt?: string
          enhanced_prompt?: string | null
          context?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompt_versions: {
        Row: {
          id: string
          prompt_id: string
          version_number: number
          prompt_text: string
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          version_number: number
          prompt_text: string
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          version_number?: number
          prompt_text?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
