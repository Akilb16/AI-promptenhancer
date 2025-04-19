"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentModel, saveModelConfig, type ModelConfig } from "@/lib/ai"

const OPENAI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
]

const HUGGINGFACE_MODELS = [
  { value: "mistralai/Mixtral-8x7B-Instruct-v0.1", label: "Mixtral 8x7B" },
  { value: "meta-llama/Llama-2-70b-chat-hf", label: "Llama 2 70B" },
  { value: "google/gemma-7b-it", label: "Gemma 7B" },
]

export function ModelSelector() {
  const [config, setConfig] = useState<ModelConfig>(getCurrentModel())
  const { toast } = useToast()

  useEffect(() => {
    setConfig(getCurrentModel())
  }, [])

  const handleProviderChange = (provider: "openai" | "huggingface") => {
    const newConfig = {
      ...config,
      provider,
      // Set default model for the selected provider
      modelName: provider === "openai" ? OPENAI_MODELS[0].value : HUGGINGFACE_MODELS[0].value,
    }
    setConfig(newConfig)
  }

  const handleModelChange = (modelName: string) => {
    setConfig({ ...config, modelName })
  }

  const handleApiKeyChange = (apiKey: string) => {
    setConfig({ ...config, apiKey })
  }

  const handleSave = () => {
    // Validate API key for Hugging Face
    if (config.provider === "huggingface" && !config.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Hugging Face API key",
        variant: "destructive",
      })
      return
    }

    saveModelConfig(config)
    toast({
      title: "Model settings saved",
      description: "Your model preferences have been updated",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Settings</CardTitle>
        <CardDescription>Choose which AI model to use for prompt enhancement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={config.provider}
          onValueChange={(value) => handleProviderChange(value as "openai" | "huggingface")}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="openai" id="openai" />
            <Label htmlFor="openai" className="font-medium">
              OpenAI
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="huggingface" id="huggingface" />
            <Label htmlFor="huggingface" className="font-medium">
              Hugging Face
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={config.modelName} onValueChange={handleModelChange}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {config.provider === "openai"
                ? OPENAI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))
                : HUGGINGFACE_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        {config.provider === "huggingface" && (
          <div className="space-y-2">
            <Label htmlFor="apiKey">Hugging Face API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey || ""}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your Hugging Face API key"
            />
            <p className="text-xs text-muted-foreground">
              You can get your API key from the{" "}
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Hugging Face settings page
              </a>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Model Settings</Button>
      </CardFooter>
    </Card>
  )
}
