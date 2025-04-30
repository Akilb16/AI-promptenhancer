"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// Demo data for preview mode
const demoPrompts = [
  {
    id: "demo-1",
    original_prompt: "Write a blog post about AI",
    enhanced_prompt:
      "Write a comprehensive, engaging blog post about the evolution of artificial intelligence from its early beginnings to current applications. Include specific examples of how AI is transforming industries such as healthcare, finance, and education. Discuss both the benefits and ethical concerns, and conclude with predictions for future developments.",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "demo-2",
    original_prompt: "Generate a product description",
    enhanced_prompt:
      "Create a compelling product description for a premium wireless noise-cancelling headphone. Highlight its key features including battery life, sound quality, comfort, and connectivity options. Use sensory language to describe the listening experience, and include specific use cases that would appeal to both casual listeners and audiophiles. Conclude with a clear value proposition that justifies the premium price point.",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

export default function HistoryPage() {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrompts() {
      try {
        if (user?.isDemo) {
          // Use demo data
          setPrompts(demoPrompts)
        } else if (user) {
          // Fetch real data
          const supabase = createClient()
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (error) throw error
          setPrompts(data || [])
        }
      } catch (err: any) {
        console.error("Error fetching prompts:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPrompts()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt History</h1>
        <p className="text-muted-foreground">
          View and manage your previously enhanced prompts
          {user?.isDemo && " (Demo Mode)"}
        </p>
      </div>

      {error && (
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {prompts && prompts.length > 0 ? (
          prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{prompt.original_prompt}</CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">Enhanced Prompt:</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{prompt.enhanced_prompt}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/history/${prompt.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No prompts yet</CardTitle>
              <CardDescription>You haven't enhanced any prompts yet</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create your first enhanced prompt to see it here</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/dashboard">Create Prompt</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
