import Box from "@/components/ui/box"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login and Register pages",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box as="div" className="min-h-screen flex">
      {/* Left side (form) */}
      <Box as="div" className="flex-1 flex items-center justify-center bg-background">
        {children}
      </Box>

      {/* Right side (image or text) */}
    
    </Box>
  )
}
