"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup, isAuthenticated } from "@/lib/auth"
import { BookOpen, Volume2, Users, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = isLogin 
      ? login(username || email, password) 
      : signup(username, email, password)

    if (success) {
      router.push("/language-select")
    } else {
      if (isLogin) {
        setError("Invalid username/email or password, or user doesn't exist")
      } else {
        setError("Please fill in all fields")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 pt-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-glow animate-float">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Learnbridge
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-balance mb-2 bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
            Math in Your Language, For Every Child
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Lissafi a Harshenka | Lissafi Harshenka | الرياضيات بلغتك
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="text-center hover:shadow-glow transition-all border-primary/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg">
                <Volume2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Voice-First Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Learn and answer in your own language with voice support
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-glow transition-all border-secondary/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="mx-auto bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Accessible for All</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Designed for children with and without disabilities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-glow transition-all border-accent/20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <div className="mx-auto bg-gradient-to-br from-accent to-accent/80 text-accent-foreground p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Fun & Interactive</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Engaging lessons with visuals, audio, and practice
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Form */}
        <Card className="max-w-md mx-auto shadow-xl border-primary/10 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isLogin ? "Welcome Back!" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {isLogin ? "Enter any email and password to continue" : "Create your account with any email and password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-semibold">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-base border-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor={isLogin ? "usernameOrEmail" : "email"} className="text-base font-semibold">
                  {isLogin ? "Username or Email" : "Email"}
                </Label>
                <Input
                  id={isLogin ? "usernameOrEmail" : "email"}
                  type={isLogin ? "text" : "email"}
                  placeholder={isLogin ? "Username or email" : "your@email.com"}
                  value={isLogin ? username : email}
                  onChange={(e) => isLogin ? setUsername(e.target.value) : setEmail(e.target.value)}
                  className="h-12 text-base border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all" size="lg">
                {isLogin ? "Start Learning" : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-secondary transition-colors text-base font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="bg-gradient-to-r from-muted to-muted/50 p-4 rounded-xl border border-primary/10">
            <strong className="text-primary">Demo Mode:</strong> This is an MVP with dummy authentication. Any email and password will work. Your
            progress is saved locally.
          </p>
        </div>
      </div>
    </div>
  )
}