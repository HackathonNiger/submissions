'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SubjectsPage() {
  const router = useRouter()

  const scienceSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'Further Mathematics',
    'Technical Drawing',
    'Computer Science',
    'Data Processing',
    'Agricultural Science',
    'Civic Education',
  ]

  const artsCommercialSubjects = [
    'English Language',
    'Literature in English',
    'History',
    'Government',
    'Economics',
    'Christian Religious Studies (CRS)',
    'Islamic Religious Studies (IRS)',
    'French',
    'Commerce',
    'Accounting',
    'Igbo Language',
  ]

  const handleSubjectClick = (subject: string) => {
    router.push(`/flashCard/${subject.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <main className="flex justify-center items-start min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-20 sm:pb-0">
      <Card className="w-full max-w-5xl p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl transition-colors duration-300">
          <head>
        <title>Flash Cards | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </head>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Pick a subject
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Science Subjects */}
          <div className="flex flex-col gap-4">
            {scienceSubjects.map((subject) => (
              <Button
                key={subject}
                className="w-full bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-colors duration-300"
                onClick={() => handleSubjectClick(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* Arts & Commercial Subjects */}
          <div className="flex flex-col gap-4">
            {artsCommercialSubjects.map((subject) => (
              <Button
                key={subject}
                className="w-full bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-colors duration-300"
                onClick={() => handleSubjectClick(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </main>
  )
}
