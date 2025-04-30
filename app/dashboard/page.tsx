"use client"

import { PromptForm } from "@/components/prompt-form"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Engineer</h1>
        <p className="text-muted-foreground">
          Enhance your prompts for better results from large language models
          {user?.isDemo && " (Demo Mode)"}
        </p>
      </div>
      <PromptForm />
    </div>
  )
}
