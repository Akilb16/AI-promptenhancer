import { PromptForm } from "@/components/prompt-form"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Engineer</h1>
        <p className="text-muted-foreground">Enhance your prompts for better results from large language models</p>
      </div>
      <PromptForm />
    </div>
  )
}
