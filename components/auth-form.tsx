"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface AuthFormProps {
  type: "login" | "signup"
}

// Check if we're in a preview environment
const isPreview =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost")

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (type === "signup") {
        await signUp(email, password)
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })
      } else {
        await signIn(email, password)
      }

      router.push("/dashboard")
    } catch (err: any) {
      console.error("Authentication error:", err)
      setError(err.message || "An error occurred during authentication")
      toast({
        title: "Authentication Error",
        description: err.message || "An error occurred during authentication",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{type === "login" ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {type === "login" ? "Enter your credentials to access your account" : "Create an account to get started"}
        </CardDescription>
      </CardHeader>

      {isPreview && (
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>
              For demo purposes, use <strong>demo@example.com</strong> with any password to log in, or leave the fields
              empty.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}

      {error && (
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={isPreview ? "demo@example.com" : "your.email@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!isPreview}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isPreview}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
