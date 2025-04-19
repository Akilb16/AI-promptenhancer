import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { CopyButton } from "@/components/copy-button"

export default async function PromptDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session?.user.id)
    .single()

  if (error || !prompt) {
    notFound()
  }

  // Parse context if available
  let clarifyingQuestions = []
  let suggestions: string[] = []
  let modelConfig = { provider: "openai", modelName: "gpt-4o" }

  if (prompt.context) {
    try {
      const context = JSON.parse(prompt.context)
      clarifyingQuestions = context.clarifyingQuestions || []

      // Process suggestions to ensure they're strings
      if (context.suggestions && Array.isArray(context.suggestions)) {
        suggestions = context.suggestions.map((suggestion: any) => {
          if (typeof suggestion === "object" && suggestion !== null && "suggestion" in suggestion) {
            return String(suggestion.suggestion)
          }
          return String(suggestion)
        })
      }

      if (context.modelConfig) {
        modelConfig = context.modelConfig
      }
    } catch (e) {
      console.error("Error parsing context:", e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Details</h1>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
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
              {modelConfig.provider === "openai" ? "OpenAI" : "Hugging Face"}: {modelConfig.modelName.split("/").pop()}
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
