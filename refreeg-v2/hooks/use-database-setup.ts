"use client"

import { useState, useEffect } from "react"
import { checkDatabaseSetup } from "@/actions/database-actions"

export function useDatabaseSetup() {
  const [isReady, setIsReady] = useState<boolean | null>(null)
  const [missingTables, setMissingTables] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const result = await checkDatabaseSetup()
        setIsReady(result.ready)
        setMissingTables(result.missingTables || [])
      } catch (err: any) {
        console.error("Error checking database setup:", err)
        setError(err.message)
        setIsReady(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkSetup()
  }, [])

  return {
    isReady,
    missingTables,
    isLoading,
    error,
  }
}

