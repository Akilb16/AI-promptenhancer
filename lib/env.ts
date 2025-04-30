// Environment variables with type safety
export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,

  // Hugging Face
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY as string,
}
