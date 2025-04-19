"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copying, setCopying] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "The enhanced prompt has been copied to your clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      })
    } finally {
      setCopying(false)
    }
  }

  return (
    <Button onClick={copyToClipboard} disabled={copying}>
      {copying ? "Copying..." : "Copy to Clipboard"}
    </Button>
  )
}
