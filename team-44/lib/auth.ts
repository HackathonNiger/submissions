"use client"

import type { User } from "./types"

const USER_KEY = "learnbridge_user"

export function login(usernameOrEmail: string, password: string): boolean {
  // Dummy authentication - accepts any username/email and password
  if (usernameOrEmail && password) {
    const existingUser = getUser()
    if (!existingUser || (existingUser.username !== usernameOrEmail && existingUser.email !== usernameOrEmail)) {
      return false // User doesn't exist for login
    }
    return true
  }
  return false
}

export function signup(username: string, email: string, password: string): boolean {
  // Dummy authentication - accepts any username, email and password
  if (username && email && password) {
    const newUser: User = {
      username,
      email,
      language: "english", // Default to English, user will select language next
      progress: {},
      settings: {
        dyslexiaFont: false,
        audioSpeed: "normal",
        audioPitch: "normal",
        subtitles: true,
        audioNavigation: false,
      },
    }
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(USER_KEY)
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export function updateUser(updates: Partial<User>): void {
  const user = getUser()
  if (user) {
    const updatedUser = { ...user, ...updates }
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}