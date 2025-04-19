"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function ModelSelector() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Settings</CardTitle>
        <CardDescription>Using Mixtral 8x7B for prompt enhancement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Mixtral 8x7B
          </Badge>
          <span className="text-sm text-muted-foreground">
            A state-of-the-art language model for high-quality prompt enhancements
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This application uses the Mixtral 8x7B model from Hugging Face for all prompt enhancements.
        </p>
      </CardFooter>
    </Card>
  )
}
