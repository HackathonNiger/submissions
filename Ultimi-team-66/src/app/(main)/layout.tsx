'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import Box from '@/components/ui/box'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import Sidebar from '@/components/ui/app-sidebar'
import { ThemeProvider } from 'next-themes'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <ProtectedRoute>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      </SidebarProvider>
    </ThemeProvider>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex min-h-screen">
      <Sidebar /> 
      {/* <SidebarTrigger className='relative'/> */}
      <Box
        as="main"
        className="flex-1 flex flex-col transition-all duration-300" // flex-1 fills remaining space
      >
      <SidebarTrigger size="icon" className='z-100000 absolute ml-[7px] hidden sm:block'/>


        {/* Main content */}
        <Box className="flex-1 overflow-auto">{children}</Box>
      </Box>
    </Box>
  )
}
