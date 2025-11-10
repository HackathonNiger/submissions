// hooks/useQuizScores.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface QuizScore {
  points: number
  taken_at: string
}

export const useQuizScores = () => {
  const [scores, setScores] = useState<QuizScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchScores() {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        // Get student's ID
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('id', user.id)
          .single()

        if (studentError || !student) {
          setError('Student profile not found')
          return
        }

        const { data, error } = await supabase
          .from('quiz_scores')
          .select('points, taken_at')
          .eq('student_id', student.id)
          .order('taken_at', { ascending: true })

        if (error) {
          setError(error.message)
        } else {
          setScores(data || [])
        }
      } catch (err) {
        setError('Failed to fetch scores')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchScores()
  }, [])

  return { scores, loading, error }
}