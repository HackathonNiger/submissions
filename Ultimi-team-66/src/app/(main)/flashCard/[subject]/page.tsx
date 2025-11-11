'use client'

import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TopicsPage() {
  const router = useRouter()
  const { subject } = useParams()

  const topicsData: Record<string, string[]> = {
    mathematics: ['Algebra', 'Trigonometry', 'Statistics', 'Plane Geometry', 'Mensuration', 'Indices and Logarithms', 'Sets', 'Probability', 'Linear Programming', 'Vectors'],
    physics: ['Mechanics', 'Electricity', 'Waves', 'Optics', 'Heat', 'Modern Physics', 'Fluid Mechanics', 'Nuclear Physics', 'Thermodynamics', 'Magnetism'],
    chemistry: ['Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'Acids and Bases', 'Organic Chemistry', 'Electrochemistry', 'Thermochemistry', 'Equilibria', 'Redox Reactions', 'Environmental Chemistry'],
    biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology', 'Microbiology', 'Evolution', 'Reproduction', 'Nutrition', 'Excretion'],
    geography: ['Physical Geography', 'Human Geography', 'Climatology', 'Cartography', 'Economic Geography', 'Population Studies', 'Urbanization', 'Agricultural Geography', 'Industrial Geography', 'Environmental Management'],
    'further-mathematics': ['Complex Numbers', 'Matrices', 'Differential Equations', 'Vectors', 'Linear Programming', 'Probability', 'Statistics', 'Calculus', 'Coordinate Geometry', 'Number Theory'],
    'technical-drawing': ['Geometrical Drawing', 'Building Drawing', 'Engineering Drawing', 'Machine Drawing', 'Orthographic Projection', 'Isometric Drawing', 'Sectional Views', 'Dimensioning', 'Scale Drawing', 'CAD'],
    'computer-science': ['Computer Fundamentals', 'Programming Languages', 'Data Structures', 'Database Management', 'Software Engineering', 'Computer Networks', 'Operating Systems', 'Internet Technology', 'AI Basics', 'Cyber Security'],
    'data-processing': ['Data Representation', 'Computer Hardware', 'Software Applications', 'Data Storage', 'Data Retrieval', 'Data Analysis', 'Information Systems', 'Database Management', 'Networking', 'Programming Concepts'],
    'agricultural-science': ['Crop Production', 'Animal Husbandry', 'Soil Science', 'Agricultural Economics', 'Farm Management', 'Pest Control', 'Agricultural Extension', 'Agricultural Engineering', 'Forestry', 'Fisheries'],
    'civic-education': ['Citizenship', 'Democracy', 'Rule of Law', 'Human Rights', 'National Development', 'Peace and Conflict Resolution', 'Environmental Education', 'National Symbols', 'Government Institutions', 'Leadership'],
    'english-language': ['Comprehension', 'Essay Writing', 'Summary', 'Grammar', 'Vocabulary', 'Oral English', 'Literary Appreciation', 'Speech Work', 'Writing Skills', 'Reading Skills'],
    'literature-in-english': ['Drama', 'Poetry', 'Prose Fiction', 'Literary Devices', 'Themes', 'Characterization', 'Plot Development', 'Setting', 'Style', 'Contextual Analysis'],
    'history': ['Pre-Colonial Africa', 'Colonialism', 'Nationalism', 'Independence Movements', 'Post-Colonial Africa', 'World Wars', 'Cold War', 'African Leaders', 'Pan-Africanism', 'African Institutions'],
    'government': ['Political Systems', 'Constitutional Development', 'Political Parties', 'Elections', 'Governance', 'Public Policy', 'International Relations', 'Human Rights', 'Democracy', 'Political Ideologies'],
    'economics': ['Microeconomics', 'Macroeconomics', 'Economic Systems', 'Market Structures', 'Inflation', 'Unemployment', 'Fiscal Policy', 'Monetary Policy', 'International Trade', 'Economic Development'],
    'christian-religious-studies-(crs)': ['Creation', 'Sin and Salvation', 'Jesus Christ', 'Christian Ethics', 'Church History', 'Christianity and Society', 'The Bible', 'Christian Worship', 'Christian Denominations', 'Christian Mission'],
    'islamic-religious-studies-(irs)': ['Creation', 'Prophethood', 'Islamic Ethics', 'The Qur\'an', 'Hadith', 'Islamic Law', 'Islamic History', 'Islamic Worship', 'Islamic Society', 'Islamic Civilization'],
    'french': ['Grammar', 'Vocabulary', 'Comprehension', 'Composition', 'Oral French', 'French Culture', 'French Literature', 'Translation', 'French Phonetics', 'French Syntax'],
    'commerce': ['Business Activities', 'Business Environment', 'Marketing', 'Finance', 'Accounting', 'Business Organizations', 'Entrepreneurship', 'International Trade', 'Business Communication', 'Consumer Protection'],
    'accounting': ['Bookkeeping', 'Financial Statements', 'Accounting Principles', 'Cost Accounting', 'Management Accounting', 'Auditing', 'Taxation', 'Financial Analysis', 'Accounting Software', 'Ethics in Accounting'],
    'igbo-language': ['Grammar', 'Vocabulary', 'Oral Igbo', 'Igbo Literature', 'Igbo Culture', 'Translation', 'Composition', 'Proverbs', 'Folklore', 'Igbo History']
  }

  const topics = topicsData[subject as string] || []

  const handleTopicClick = (topic: string) => {
    router.push(`/flashCard/${subject}/${topic.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <main className="flex justify-center min-h-screen p-6 sm:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-4xl p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl transition-colors duration-300">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Pick a topic
        </h1>

        {/* Topics grid */}
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <Button
                key={topic}
                className="w-full bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-colors duration-300"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No topics found for this subject.</p>
        )}

        {/* Back button (centered, natural width) */}
        <div className="mt-6 flex justify-center">
          <Button
            className="bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors duration-300"
            onClick={() => router.push('/flashCard')}
          >
            ← Back to Subjects
          </Button>
        </div>
      </Card>
    </main>
  )
}
