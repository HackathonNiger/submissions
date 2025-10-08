"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CopyEmailProps {
  email: string
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast({
        title: "Email copied!",
        description: `${email} has been copied to clipboard.`,
      })
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy email to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <span 
      className="text-sm text-muted-foreground cursor-pointer  transition-colors flex items-center space-x-1"
      onClick={copyToClipboard}
      title="Click to copy email"
    >
      <span>{email}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </span>
  )
} 