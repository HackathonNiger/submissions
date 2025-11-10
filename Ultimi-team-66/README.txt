Project Name: Ultimi

Tagline: Learn smarter, not harder.

Overview:
Ultimi is an AI-powered web application designed to help students study more effectively by transforming their learning materials into personalized quizzes. Students can upload various file formats—including PDFs, Word documents, PowerPoint slides, or images of handwritten notes—and the AI intelligently extracts key information to generate interactive quizzes such as multiple-choice, true/false, and short-answer questions. The platform also features a question bank for extra practice and a leaderboard that fosters motivation through friendly competition.

Beyond enhancing learning efficiency, Ultimi promotes educational equity by offering scholarships and financial support to underprivileged but hardworking students. Sponsored by organizations and partners, the system rewards the top 27 students on its yearly leaderboard, with the number of scholarships increasing as the user base grows. In the long term, Ultimi aims to evolve into a global academic social network where students across all levels can collaborate, share knowledge, and even earn financial rewards for their academic performance and engagement.


⚙️ Features:

Ultimi offers a rich set of tools that make learning more engaging, efficient, and rewarding:

🧠 Ultimi AI Tutor: Provides intelligent tutoring for WAEC, JAMB, and NECO exams, while also allowing students to upload notes or documents to automatically generate personalized quizzes.

📝 Built-in Quiz System: Automatically creates quizzes in multiple formats (MCQs, true/false, short-answer) from uploaded materials and the question bank.

🎯 Leaderboard: Encourages healthy competition by ranking students based on performance, consistency, and engagement.

📊 Progress View: Allows students to track their learning performance, quiz results, and overall improvement over time.

🔥 Streaks: Motivates learners through daily and weekly activity streaks to build consistent study habits.

💬 Messages (Chat): Enables real-time communication among students, tutors, and sponsors for better collaboration.

📰 Opinions & Reports: Collects feedback and improvement suggestions directly from users to enhance the platform.

🧾 Flashcards: Offers interactive flashcards for studying and practicing different subjects and topics.

🎓 Students Dashboard: A personalized space for students to manage their learning, quizzes, and progress analytics.

💼 Sponsors Dashboard: Allows sponsors to monitor scholarship beneficiaries, track performance, and manage financial support programs.

🔔 Notifications: Sends updates on new messages, achievements, leaderboard changes, and engagement opportunities.



🧑‍💻 Tech Stack:

Ultimi is built using modern web technologies and libraries to ensure scalability, performance, and a smooth user experience.

Frontend

Framework: Next.js (v15.5.2) with React (v19.1.0)

Styling: Tailwind CSS, SASS, PostCSS, Autoprefixer, tw-animate-css

UI Components: Radix UI (for modular UI primitives), Lucide Icons, Framer Motion (for animations), clsx & class-variance-authority (for conditional styling)

Charts & Visualization: Chart.js, React Chart.js 2, Recharts

3D & Graphics: Three.js, @react-three/fiber, @react-three/drei, three-stdlib, Vanta.js (background animations), Lottie React (illustrations/animations)

Carousel & Effects: Embla Carousel React, React Confetti

Backend & Services

Backend Framework: Next.js API routes

Database & Authentication: Supabase

Email & Notifications: Nodemailer, Resend (email delivery)

Data Fetching & Caching: Axios, TanStack React Query

Utilities: Lodash, Date-fns, UUID

AI & Media Integration

AI Quiz Generation / Tutoring: Custom integration via APIs (e.g., OpenAI or Hugging Face)

Audio & Video: React Media Recorder, Wavesurfer.js (for audio visualization and playback)

3D & Animation Tools: Rive Canvas, Three.js

Developer Tools

Linting & Formatting: ESLint, eslint-config-next

Language & Types: TypeScript

Version Control: Git

Build Tools: Next.js Build System, Tailwind Merge





⚙️ Installation & Setup Instructions

Follow these steps to run Ultimi locally:

Clone the repository:

git clone https://github.com/<your-team>/<repository-name>.git
cd <repository-name>


Install dependencies:

npm install


Create an environment file:
In the project root, create a .env.local file and add the required environment variables (e.g., Supabase keys, AI API keys, email credentials). Example:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=


Run the development server:
npm run dev


Open the app in your browser:

http://localhost:3000



Usage Guide:





🔗 API & Library Declaration:

| Library / API                 | Purpose                                             | Link                                                                                                |
| ----------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Next.js**                   | Frontend framework for building scalable React apps | [https://nextjs.org](https://nextjs.org)                                                            |
| **React**                     | Component-based UI library                          | [https://react.dev](https://react.dev)                                                              |
| **Tailwind CSS**              | Utility-first CSS framework for styling             | [https://tailwindcss.com](https://tailwindcss.com)                                                  |
| **Framer Motion**             | Animations and transitions                          | [https://www.framer.com/motion](https://www.framer.com/motion)                                      |
| **Radix UI**                  | Accessible, low-level UI components                 | [https://www.radix-ui.com](https://www.radix-ui.com)                                                |
| **Supabase**                  | Authentication and database backend                 | [https://supabase.com](https://supabase.com)                                                        |
| **OpenAI API / Hugging Face** | AI-powered quiz generation and tutoring             | [https://openai.com/api](https://openai.com/api) / [https://huggingface.co](https://huggingface.co) |
| **Axios**                     | HTTP client for API communication                   | [https://axios-http.com](https://axios-http.com)                                                    |
| **Chart.js / Recharts**       | Data visualization and progress charts              | [https://www.chartjs.org](https://www.chartjs.org) / [https://recharts.org](https://recharts.org)   |
| **Three.js / R3F / Drei**     | 3D visuals and interactive graphics                 | [https://threejs.org](https://threejs.org)                                                          |
| **Lottie React**              | Animated vector illustrations                       | [https://lottiefiles.com](https://lottiefiles.com)                                                  |
| **Vanta.js**                  | Animated backgrounds                                | [https://www.vantajs.com](https://www.vantajs.com)                                                  |
| **Resend / Nodemailer**       | Email notifications and communication               | [https://resend.com](https://resend.com) / [https://nodemailer.com](https://nodemailer.com)         |
| **TanStack React Query**      | Data fetching and caching                           | [https://tanstack.com/query/latest](https://tanstack.com/query/latest)                              |
| **Wavesurfer.js**             | Audio waveform visualization                        | [https://wavesurfer.xyz](https://wavesurfer.xyz)                                                    |
| **Embla Carousel**            | Interactive carousels and sliders                   | [https://www.embla-carousel.com](https://www.embla-carousel.com)                                    |
| **Rive**                      | Vector-based animations and interactions            | [https://rive.app](https://rive.app)                                                                |



Folder Structure:
📦src
 ┣ 📂app
 ┃ ┣ 📂(auth)
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂register
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📂(main)
 ┃ ┃ ┣ 📂connections
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂flashCard
 ┃ ┃ ┃ ┣ 📂[subject]
 ┃ ┃ ┃ ┃ ┣ 📂[topic]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂leaderboard
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂messages
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂notifications
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂opinions
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂progress
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂quiz
 ┃ ┃ ┃ ┣ 📂domain-selection___
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂home
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂preview
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📂result
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜providers.tsx
 ┃ ┃ ┣ 📂settings
 ┃ ┃ ┃ ┗ 📂profile-setup
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂sponsors
 ┃ ┃ ┃ ┣ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜types.ts
 ┃ ┃ ┣ 📂streaks
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂ultimi-ai
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┗ 📂send-otp
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂public
 ┃ ┃ ┣ 📂animations
 ┃ ┃ ┃ ┣ 📜Reactions.tsx
 ┃ ┃ ┃ ┣ 📜clap.json
 ┃ ┃ ┃ ┗ 📜streak.riv
 ┃ ┃ ┣ 📜FOCUS.jpeg
 ┃ ┃ ┣ 📜He.jpeg
 ┃ ┃ ┣ 📜Jesus.jpeg
 ┃ ┃ ┣ 📜ghost.jpeg
 ┃ ┃ ┣ 📜icon.jpg
 ┃ ┃ ┣ 📜icon@.jpg
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜notification.mp3
 ┃ ┃ ┣ 📜squid.jpeg
 ┃ ┃ ┣ 📜tooth.jpeg
 ┃ ┃ ┣ 📜ultimi.jpeg
 ┃ ┃ ┗ 📜zoot.jpeg
 ┃ ┣ 📂theme
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜page.tsx
 ┣ 📂components
 ┃ ┣ 📂ui
 ┃ ┃ ┣ 📂leagueBadge
 ┃ ┃ ┃ ┣ 📜BronzeCelebration.tsx
 ┃ ┃ ┃ ┣ 📜CelebrationWrapper.tsx
 ┃ ┃ ┃ ┣ 📜DiamondCelebration.tsx
 ┃ ┃ ┃ ┣ 📜GoldCelebration.tsx
 ┃ ┃ ┃ ┣ 📜PalladiumCelebration.tsx
 ┃ ┃ ┃ ┣ 📜PlatinumCelebration.tsx
 ┃ ┃ ┃ ┗ 📜SilverCelebration.tsx
 ┃ ┃ ┣ 📜 popover.tsx
 ┃ ┃ ┣ 📜 tabs.tsx
 ┃ ┃ ┣ 📜ProtectedRoute.tsx
 ┃ ┃ ┣ 📜accordion.tsx
 ┃ ┃ ┣ 📜alert-dialog.tsx
 ┃ ┃ ┣ 📜app-sidebar.tsx
 ┃ ┃ ┣ 📜avatar.tsx
 ┃ ┃ ┣ 📜badge.tsx
 ┃ ┃ ┣ 📜box.tsx
 ┃ ┃ ┣ 📜button.tsx
 ┃ ┃ ┣ 📜card.tsx
 ┃ ┃ ┣ 📜carousel.tsx
 ┃ ┃ ┣ 📜chart.tsx
 ┃ ┃ ┣ 📜checkbox.tsx
 ┃ ┃ ┣ 📜collapsible.tsx
 ┃ ┃ ┣ 📜dialog.tsx
 ┃ ┃ ┣ 📜dropdown-menu.tsx
 ┃ ┃ ┣ 📜form.tsx
 ┃ ┃ ┣ 📜input-otp.tsx
 ┃ ┃ ┣ 📜input.tsx
 ┃ ┃ ┣ 📜label.tsx
 ┃ ┃ ┣ 📜pagination.tsx
 ┃ ┃ ┣ 📜profileTextArea.tsx
 ┃ ┃ ┣ 📜radio-group.tsx
 ┃ ┃ ┣ 📜select.tsx
 ┃ ┃ ┣ 📜separator.tsx
 ┃ ┃ ┣ 📜sheet.tsx
 ┃ ┃ ┣ 📜sidebar.tsx
 ┃ ┃ ┣ 📜skeleton.tsx
 ┃ ┃ ┣ 📜switch.tsx
 ┃ ┃ ┣ 📜table.tsx
 ┃ ┃ ┣ 📜tabs.tsx
 ┃ ┃ ┣ 📜textarea.tsx
 ┃ ┃ ┗ 📜tooltip.tsx
 ┃ ┣ 📂widgets
 ┃ ┃ ┣ 📜coming-soon.tsx
 ┃ ┃ ┗ 📜mobile-nav.tsx
 ┃ ┗ 📜chart-area-interactive.tsx
 ┣ 📂data
 ┃ ┗ 📜questions.ts
 ┣ 📂features
 ┃ ┣ 📂dashboard
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜league-badge-3d.tsx
 ┃ ┃ ┃ ┗ 📜league-badge-mesh.tsx
 ┃ ┃ ┣ 📂context
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜useChartOptions.tsx
 ┃ ┃ ┃ ┗ 📜useFetchStudentsStats.tsx
 ┃ ┃ ┣ 📜dashboard.module.tsx
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂leaderboard
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┃ ┣ 📜filters.tsx
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜leaderboard-table.tsx
 ┃ ┃ ┃ ┣ 📜league-filter.tsx
 ┃ ┃ ┃ ┣ 📜pagination-controls.tsx
 ┃ ┃ ┃ ┣ 📜search-input.tsx
 ┃ ┃ ┃ ┗ 📜table-content.tsx
 ┃ ┃ ┣ 📂context
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜useAuth.tsx
 ┃ ┃ ┃ ┣ 📜useConnect.tsx
 ┃ ┃ ┃ ┣ 📜useDataFetch.tsx
 ┃ ┃ ┃ ┣ 📜useDataFilters.tsx
 ┃ ┃ ┃ ┣ 📜useFetchData.tsx
 ┃ ┃ ┃ ┣ 📜useFetchStudentsStats.tsx
 ┃ ┃ ┃ ┗ 📜useFilters.tsx
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜leaderboard.module.tsx
 ┃ ┣ 📂messages
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜chat-background-wrapper.tsx
 ┃ ┃ ┃ ┣ 📜chat-header.tsx
 ┃ ┃ ┃ ┣ 📜chat-list.tsx
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜message-input.tsx
 ┃ ┃ ┃ ┗ 📜message-list.tsx
 ┃ ┃ ┣ 📂context
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜useConnectedUsers.tsx
 ┃ ┃ ┃ ┣ 📜useCurrentUser.tsx
 ┃ ┃ ┃ ┣ 📜useDeleteMessage.tsx
 ┃ ┃ ┃ ┣ 📜useMessages.tsx
 ┃ ┃ ┃ ┣ 📜useOnlineStatus.tsx
 ┃ ┃ ┃ ┣ 📜useRealtimeMessages.tsx
 ┃ ┃ ┃ ┣ 📜useScrollBehavior.tsx
 ┃ ┃ ┃ ┣ 📜useSendMessage.tsx
 ┃ ┃ ┃ ┗ 📜useSidebar.tsx
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜messages.module.tsx
 ┃ ┣ 📂progress
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜activity-calendar.tsx
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┗ 📜progress-chart.tsx
 ┃ ┃ ┣ 📂context
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜useActivityData.ts
 ┃ ┃ ┃ ┣ 📜useAggregatedData.ts
 ┃ ┃ ┃ ┣ 📜useAvailableYears.ts
 ┃ ┃ ┃ ┣ 📜useCalendarData.ts
 ┃ ┃ ┃ ┣ 📜useCurrentDate.ts
 ┃ ┃ ┃ ┗ 📜useQuizScores.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜progress.module.tsx
 ┃ ┣ 📂quiz
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┃ ┣ 📜LoadingSpinner.tsx
 ┃ ┃ ┃ ┣ 📜NavigationButtons.tsx
 ┃ ┃ ┃ ┣ 📜PreviewQuestion.tsx
 ┃ ┃ ┃ ┣ 📜QuestionDisplay.tsx
 ┃ ┃ ┃ ┣ 📜QuizForm.tsx
 ┃ ┃ ┃ ┣ 📜ResultDisplay.tsx
 ┃ ┃ ┃ ┣ 📜SubjectSwitcher.tsx
 ┃ ┃ ┃ ┣ 📜SubmitButton.tsx
 ┃ ┃ ┃ ┗ 📜Timer.tsx
 ┃ ┃ ┣ 📂context
 ┃ ┃ ┃ ┗ 📜QuizContext.tsx
 ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┗ 📜quiz.module.tsx
 ┃ ┗ 📜.DS_Store
 ┣ 📂hooks
 ┃ ┗ 📜use-mobile.ts
 ┣ 📂lib
 ┃ ┣ 📜fetchQuestions.ts
 ┃ ┣ 📜questions.ts
 ┃ ┣ 📜reactions.ts
 ┃ ┣ 📜supabaseClient.ts
 ┃ ┣ 📜types.ts
 ┃ ┗ 📜utils.ts
 ┣ 📂schema
 ┃ ┣ 📂dashboard
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜leagues.ts
 ┃ ┃ ┗ 📜mock-data.ts
 ┃ ┣ 📂message
 ┃ ┃ ┗ 📜backgroundOptions.ts
 ┃ ┗ 📜index.ts
 ┣ 📂styles
 ┃ ┗ 📜globals.css
 ┣ 📂types
 ┃ ┣ 📜dashboard.ts
 ┃ ┣ 📜nodemailer.d.ts
 ┃ ┗ 📜vanta.d.ts
 ┣ 📂utils
 ┃ ┣ 📜constants.ts
 ┃ ┣ 📜formatters.ts
 ┃ ┗ 📜index.ts
 ┗ 📜.DS_Store



 | Name                      | Role                 | GitHub                                       |



| ------------------------- | -------------------- | -------------------------------------------- |
| **Darlington Aja-ezo S.** | Full Stack Developer | [@darrojen](https://github.com/darrojen)     |
| **Gregory Okehie U.**     | Full Stack Developer | [@gregokehie](https://github.com/gregokehie) |
