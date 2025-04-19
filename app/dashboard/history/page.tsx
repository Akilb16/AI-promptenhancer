import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function HistoryPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching prompts:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt History</h1>
        <p className="text-muted-foreground">View and manage your previously enhanced prompts</p>
      </div>

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
