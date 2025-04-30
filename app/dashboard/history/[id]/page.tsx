"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { CopyButton } from "@/components/copy-button"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// Demo data for preview mode
const demoPrompts = {
  "demo-1": {
    id: "demo-1",
    original_prompt: "Write a blog post about AI",
    enhanced_prompt:
      "Write a comprehensive, engaging blog post about the evolution of artificial intelligence from its early beginnings to current applications. Include specific examples of how AI is transforming industries such as healthcare, finance, and education. Discuss both the benefits and ethical concerns, and conclude with predictions for future developments.",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    context: JSON.stringify({
      clarifyingQuestions: [
        {
          id: "q-1",
          question: "What specific aspects of AI are you most interested in highlighting?",
          answer: "I want to focus on practical applications and ethical considerations.",
        },
        {
          id: "q-2",
          question: "Who is your target audience for this blog post?",
          answer: "Tech-savvy professionals who are interested in AI but not experts.",
        },
        {
          id: "q-3",
          question: "What tone would you like the blog post to have?",
          answer: "Informative but conversational, with some thought-provoking elements.",
        },
      ],
      suggestions: [
        "Include specific examples of AI applications in different industries",
        "Address common misconceptions about AI",
        "Discuss the ethical implications of advanced AI systems",
      ],
    }),
  },
  "demo-2": {
    id: "demo-2",
    original_prompt: "Generate a product description",
    enhanced_prompt:
      "Create a compelling product description for a premium wireless noise-cancelling headphone. Highlight its key features including battery life, sound quality, comfort, and connectivity options. Use sensory language to describe the listening experience, and include specific use cases that would appeal to both casual listeners and audiophiles. Conclude with a clear value proposition that justifies the premium price point.",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    context: JSON.stringify({
      clarifyingQuestions: [
        {
          id: "q-1",
          question: "What is the price point of the product?",
          answer: "Premium, around $300-350",
        },
        {
          id: "q-2",
          question: "What are the key differentiating features of this product?",
          answer: "Superior noise cancellation, 30-hour battery life, and premium materials",
        },
        {
          id: "q-3",
          question: "Who is the target audience for this product?",
          answer: "Professionals who travel frequently and audiophiles who value sound quality",
        },
      ],
      suggestions: [
        "Use sensory language to describe the listening experience",
        "Highlight the practical benefits for different use cases",
        "Emphasize the premium materials and build quality",
      ],
    }),
  },
}

export default function PromptDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [prompt, setPrompt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clarifyingQuestions, setClarifyingQuestions] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    async function fetchPrompt() {
      try {
        if (user?.isDemo) {
          // Use demo data
          const demoPrompt = demoPrompts[id as string]
          if (!demoPrompt) {
            router.push("/dashboard/history")
            return
          }
          setPrompt(demoPrompt)

          // Parse context
          if (demoPrompt.context) {
            try {
              const context = JSON.parse(demoPrompt.context)
              setClarifyingQuestions(context.clarifyingQuestions || [])
              setSuggestions(context.suggestions || [])
            } catch (e) {
              console.error("Error parsing context:", e)
            }
          }
        } else if (user) {
          // Fetch real data
          const supabase = createClient()
          const { data, error } = await supabase
            .from("prompts")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single()

          if (error) throw error
          if (!data) {
            router.push("/dashboard/history")
            return
          }

          setPrompt(data)

          // Parse context
          if (data.context) {
            try {
              const context = JSON.parse(data.context)
              setClarifyingQuestions(context.clarifyingQuestions || [])

              // Process suggestions
              if (context.suggestions && Array.isArray(context.suggestions)) {
                setSuggestions(
                  context.suggestions.map((suggestion: any) => {
                    if (typeof suggestion === "object" && suggestion !== null && "suggestion" in suggestion) {
                      return String(suggestion.suggestion)
                    }
                    return String(suggestion)
                  }),
                )
              }
            } catch (e) {
              console.error("Error parsing context:", e)
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching prompt:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPrompt()
    }
  }, [id, user, router])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/history">Back to History</Link>
          </Button>
        </div>
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Prompt Not Found</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/history">Back to History</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Details</h1>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
            {user?.isDemo && " (Demo Mode)"}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/history">Back to History</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Original Prompt</CardTitle>
            <Badge variant="outline">
              <Sparkles className="h-3 w-3 mr-1 text-primary" />
              Mixtral 8x7B
            </Badge>
          </CardHeader>
          <CardContent>
            <p>{prompt.original_prompt}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enhanced Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{prompt.enhanced_prompt}</p>
          </CardContent>
          <CardFooter>
            <CopyButton text={prompt.enhanced_prompt || ""} />
          </CardFooter>
        </Card>

        {clarifyingQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Clarifying Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clarifyingQuestions.map((q: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">{q.question}</h3>
                    <p className="text-sm text-muted-foreground">{q.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
