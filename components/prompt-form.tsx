"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  type ClarifyingQuestion,
  generateClarifyingQuestions,
  generateSuggestions,
  enhancePrompt,
  getCurrentModel,
} from "@/lib/ai"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

enum PromptStage {
  INITIAL = 0,
  CLARIFYING = 1,
  SUGGESTIONS = 2,
  ENHANCED = 3,
}

export function PromptForm() {
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [enhancedPromptText, setEnhancedPromptText] = useState("")
  const [stage, setStage] = useState<PromptStage>(PromptStage.INITIAL)
  const [loading, setLoading] = useState(false)
  const [modelConfig, setModelConfig] = useState(getCurrentModel())
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  // Update model config when it changes
  useEffect(() => {
    const checkModelConfig = () => {
      const currentConfig = getCurrentModel()
      setModelConfig(currentConfig)
    }

    // Check on mount
    checkModelConfig()

    // Set up event listener for storage changes
    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkModelConfig)
      return () => window.removeEventListener("storage", checkModelConfig)
    }
  }, [])

  const handleSubmitOriginalPrompt = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to enhance",
        variant: "destructive",
      })
      return
    }

    // Check if Hugging Face is selected but no API key is provided
    if (modelConfig.provider === "huggingface" && !modelConfig.apiKey) {
      setError("Hugging Face API key is required. Please add it in the settings.")
      return
    }

    setError(null)
    setLoading(true)
    try {
      // Generate clarifying questions
      const questions = await generateClarifyingQuestions(originalPrompt)
      setClarifyingQuestions(questions.map((q) => ({ ...q, answer: "" })))

      // Generate suggestions
      const promptSuggestions = await generateSuggestions(originalPrompt)

      // Ensure suggestions is an array of strings
      const processedSuggestions = promptSuggestions.map((suggestion) => {
        // If suggestion is an object with a 'suggestion' property, extract it
        if (typeof suggestion === "object" && suggestion !== null && "suggestion" in suggestion) {
          return String(suggestion.suggestion)
        }
        // Otherwise, convert to string
        return String(suggestion)
      })

      setSuggestions(processedSuggestions)
      setStage(PromptStage.CLARIFYING)
    } catch (error: any) {
      setError(error.message || "An error occurred while processing your prompt")
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing your prompt",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (id: string, answer: string) => {
    setClarifyingQuestions(clarifyingQuestions.map((q) => (q.id === id ? { ...q, answer } : q)))
  }

  const handleSubmitAnswers = async () => {
    // Check if all questions have been answered
    const unansweredQuestions = clarifyingQuestions.filter((q) => !q.answer.trim())
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Missing answers",
        description: "Please answer all clarifying questions",
        variant: "destructive",
      })
      return
    }

    setError(null)
    setLoading(true)
    try {
      // Generate enhanced prompt
      const enhanced = await enhancePrompt(originalPrompt, clarifyingQuestions)
      setEnhancedPromptText(enhanced)
      setStage(PromptStage.ENHANCED)

      // Save to database
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: promptData, error: promptError } = await supabase
          .from("prompts")
          .insert({
            user_id: user.id,
            original_prompt: originalPrompt,
            enhanced_prompt: enhanced,
            context: JSON.stringify({
              clarifyingQuestions,
              suggestions,
              modelConfig: {
                provider: modelConfig.provider,
                modelName: modelConfig.modelName,
                // Don't store API key in the database
              },
            }),
          })
          .select()

        if (promptError) {
          console.error("Error saving prompt:", promptError)
        } else if (promptData && promptData.length > 0) {
          // Save prompt version
          await supabase.from("prompt_versions").insert({
            prompt_id: promptData[0].id,
            version_number: 1,
            prompt_text: enhanced,
          })
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while enhancing your prompt")
      toast({
        title: "Error",
        description: error.message || "An error occurred while enhancing your prompt",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setOriginalPrompt("")
    setClarifyingQuestions([])
    setSuggestions([])
    setEnhancedPromptText("")
    setStage(PromptStage.INITIAL)
    setError(null)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedPromptText)
    toast({
      title: "Copied to clipboard",
      description: "The enhanced prompt has been copied to your clipboard",
    })
  }

  const getModelBadge = () => {
    return (
      <Badge variant="outline" className="ml-2">
        <Sparkles className="h-3 w-3 mr-1 text-primary" />
        {modelConfig.provider === "openai" ? "OpenAI" : "Hugging Face"}: {modelConfig.modelName.split("/").pop()}
      </Badge>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            {modelConfig.provider === "huggingface" && !modelConfig.apiKey && (
              <div className="mt-2">
                <Link href="/dashboard/settings" className="text-primary underline">
                  Go to settings to add your API key
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {stage === PromptStage.INITIAL && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enhance Your Prompt</CardTitle>
                <CardDescription>Enter your initial prompt for an LLM and we'll help you improve it</CardDescription>
              </div>
              {getModelBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Your Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitOriginalPrompt} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Enhance Prompt"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {stage === PromptStage.CLARIFYING && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clarifying Questions</CardTitle>
                <CardDescription>Please answer these questions to help us better understand your needs</CardDescription>
              </div>
              {getModelBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clarifyingQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label>{q.question}</Label>
                  <Textarea
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Your answer..."
                    className="min-h-20"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Suggestions for Improvement</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Start Over
            </Button>
            <Button onClick={handleSubmitAnswers} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                "Generate Enhanced Prompt"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {stage === PromptStage.ENHANCED && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enhanced Prompt</CardTitle>
                <CardDescription>Here's your enhanced prompt, optimized for better results</CardDescription>
              </div>
              {getModelBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enhanced-prompt">Enhanced Prompt</Label>
                <div className="relative">
                  <Textarea id="enhanced-prompt" value={enhancedPromptText} readOnly className="min-h-32 pr-10" />
                  <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Original Prompt</h3>
                <div className="p-4 rounded-md bg-muted">
                  <p>{originalPrompt}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReset}>Create New Prompt</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
