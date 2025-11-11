'use client'

import React from 'react'
import Box from '@/components/ui/box'
import Textarea from '@/components/ui/textarea'

interface ProfileTextareaProps {
  label: string
  value: string
  onChange: (val: string) => void
  editMode: boolean
}

const ProfileTextarea: React.FC<ProfileTextareaProps> = ({ label, value, onChange, editMode }) => {
  return (
    <Box className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 w-full">
      <span className="font-medium text-gray-600 dark:text-gray-300 sm:w-32">{label}</span>

      {editMode ? (
        <Textarea
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)  => onChange(e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="w-full sm:w-[calc(100%-8rem)] min-h-[100px] p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
        />
      ) : (
        <span className="text-gray-800 dark:text-gray-100 mt-1 sm:mt-0 break-words w-full sm:w-[calc(100%-8rem)]">
          {value || '---'}
        </span>
      )}
    </Box>
  )
}

export default ProfileTextarea
