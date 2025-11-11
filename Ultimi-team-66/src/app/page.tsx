// "use client"

// import { motion } from "framer-motion"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import ModeToggle from "@/app/theme/page"
// import Box from "@/components/ui/box"
// import { Bot, Earth, NotebookText } from "lucide-react"




// const SocialIcons = () => (
//   <div className="parent flex justify-center space-x-4">
//     <style jsx>{`
//       .parent { width: 100%; display: flex; justify-content: center; align-items: center; }
//       .child { width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; transition: all 0.5s ease-in-out; border-radius: 50%; margin: 0 5px; background: linear-gradient(45deg, var(--primary), var(--secondary)); }
//       .child:hover { background-color: var(--background); transform: perspective(180px) rotateX(60deg) translateY(2px); box-shadow: 0px 10px 10px var(--primary); }
//       .button { border: none; background-color: transparent; font-size: 20px; width: inherit; height: inherit; display: flex; justify-content: center; align-items: center; transform: translate3d(0px, 0px, 15px) perspective(180px) rotateX(-35deg) translateY(2px); border-radius: 50%; transition: all 0.5s ease-in-out; }
//       .child:hover .button { background-color: var(--background); border-radius: 50%; }
//     `}</style>
//     <div className="child child-1">
//       <button className="button btn-1">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="currentColor"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-2">
//       <button className="button btn-2">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-3">
//       <button className="button btn-3">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-4">
//       <button className="button btn-4">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>
//       </button>
//     </div>
//   </div>
// )
// export default function HomePage() {
//   return (
//     <Box className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-6">
//       {/* Hero Section */}
//       <ModeToggle />
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="max-w-3xl text-center"
//       >
//         <Box as="h1" className="text-5xl font-extrabold tracking-tight mb-4">
//           Welcome to <Box as="span" className="text-primary">Ultimi</Box>
//         </Box>
//         <Box as="p" className="text-lg text-muted-foreground mb-6">
//           Generate, practice, and challenge yourself with AI-powered quizzes.
//           Learn smarter, faster, and better.
//         </Box>

//         <Box as="div" className="flex gap-4 justify-center">
//           <Link href="/register">
//             <Button size="lg" className="rounded-2xl cursor-pointer shadow-lg">
//               Get Started
//             </Button>
//           </Link>
//           <Link href="/login">
//             <Button size="lg" variant="outline" className="cursor-pointer rounded-2xl">
//               Sign In
//             </Button>
//           </Link>
//         </Box>
//       </motion.div>

//       {/* Features Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5, duration: 0.8 }}
//         className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
//       >
//         <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
//           <CardContent className="p-6 text-center">
//             <Box 
//               as="h3" 
//               className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"
//             >
//               <NotebookText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               AI Quiz Generator
//             </Box>
//             <Box as="p" className="text-sm text-muted-foreground">
//               Upload notes or enter topics and instantly generate quizzes tailored to your needs.
//             </Box>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
//           <CardContent className="p-6 text-center">
//             <Box 
//               as="h3" 
//               className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"
//             >
//               <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
//               Smart Practice
//             </Box>
//             <Box className="text-sm text-muted-foreground">
//               Adaptive question difficulty that grows with you as you improve.
//             </Box>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
//           <CardContent className="p-6 text-center">
//             <Box 
//               as="h3" 
//               className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"
//             >
//               <Earth className="w-6 h-6 text-purple-600 dark:text-purple-400" />
//               Study Anywhere
//             </Box>
//             <Box as="p" className="text-sm text-muted-foreground">
//               Responsive design so you can learn seamlessly on mobile, tablet, or desktop.
//             </Box>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Footer */}
//       <motion.footer
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1, duration: 1 }}
//         className="mt-20 text-sm text-muted-foreground"
//       >
//         {/* © {new Date().getFullYear()} Ultimi. All rights reserved. */}
//         {/* Footer */}
//       <footer className="py-12 px-6 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-xl font-bold mb-4">Ultimi</h3>
//             <p className="text-gray-400">Your ultimate companion for exam preparation.</p>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2 text-gray-400">
//               <li><Link href="#" className="hover:text-white">Start</Link></li>
//               <li><Link href="#" className="hover:text-white">Working</Link></li>
//               <li><Link href="#" className="hover:text-white">Pricing</Link></li>
//               <li><Link href="#" className="hover:text-white">FAQ</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-4">Affiliation</h4>
//             <ul className="space-y-2 text-gray-400">
//               <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
//               <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
//             </ul>
//             <div className="mt-6">
//               <SocialIcons />
//             </div>
//           </div>
//         </div>
//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//           © {new Date().getFullYear()} Ultimi. All rights reserved.
//         </div>
//       </footer>
//       </motion.footer>
//     </Box>
//   )
// }



// "use client"

// import { motion } from "framer-motion"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import ModeToggle from "@/app/theme/page"
// import Box from "@/components/ui/box"
// import { Bot, Earth, NotebookText } from "lucide-react"

//  const SocialIcons = () => (
//   <div className="parent flex justify-center space-x-4">
//     <style jsx>{`
//       .parent { width: 100%; display: flex; justify-content: center; align-items: center; }
//       .child { width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; transition: all 0.5s ease-in-out; border-radius: 50%; margin: 0 5px; background: linear-gradient(45deg, var(--primary), var(--secondary)); }
//       .child:hover { background-color: var(--background); transform: perspective(180px) rotateX(60deg) translateY(2px); box-shadow: 0px 10px 10px var(--primary); }
//       .button { border: none; background-color: transparent; font-size: 20px; width: inherit; height: inherit; display: flex; justify-content: center; align-items: center; transform: translate3d(0px, 0px, 15px) perspective(180px) rotateX(-35deg) translateY(2px); border-radius: 50%; transition: all 0.5s ease-in-out; }
//       .child:hover .button { background-color: var(--background); border-radius: 50%; }
//     `}</style>
//     <div className="child child-1">
//       <button className="button btn-1">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="currentColor"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-2">
//       <button className="button btn-2">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-3">
//       <button className="button btn-3">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
//       </button>
//     </div>
//     <div className="child child-4">
//       <button className="button btn-4">
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>
//       </button>
//     </div>
//   </div>
// )

// // ====================
// // Home Page Component
// // ====================
// export default function HomePage() {
//   return (
//     <Box className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background to-muted p-6">
//       {/* Theme toggle */}
//       <div className="absolute top-4 right-6">
//         <ModeToggle />
//       </div>

//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="flex flex-col items-center text-center mt-16"
//       >
//         <h1 className="text-5xl font-extrabold tracking-tight mb-4">
//           Welcome to{" "}
//           <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-500">
//             Ultimi
//           </span>
//         </h1>
//         <p className="text-lg text-muted-foreground max-w-2xl mb-6">
//           Generate, practice, and challenge yourself with AI-powered quizzes.
//           Learn smarter, faster, and better.
//         </p>

//         <div className="flex gap-4 justify-center">
//           <Link href="/register">
//             <Button size="lg" className="rounded-2xl shadow-lg">
//               Get Started
//             </Button>
//           </Link>
//           <Link href="/login">
//             <Button
//               size="lg"
//               variant="outline"
//               className="rounded-2xl border-gray-400"
//             >
//               Sign In
//             </Button>
//           </Link>
//         </div>
//       </motion.div>

//       {/* Features Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5, duration: 0.8 }}
//         className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl mx-auto"
//       >
//         {[
//           {
//             icon: <NotebookText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
//             title: "AI Quiz Generator",
//             desc: "Upload notes or enter topics and instantly generate quizzes tailored to your needs.",
//           },
//           {
//             icon: <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />,
//             title: "Smart Practice",
//             desc: "Adaptive question difficulty that grows with you as you improve.",
//           },
//           {
//             icon: <Earth className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
//             title: "Study Anywhere",
//             desc: "Responsive design so you can learn seamlessly on mobile, tablet, or desktop.",
//           },
//         ].map((item, i) => (
//           <Card
//             key={i}
//             className="rounded-2xl shadow-md hover:shadow-xl transition"
//           >
//             <CardContent className="p-6 text-center">
//               <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
//                 {item.icon}
//                 {item.title}
//               </h3>
//               <p className="text-sm text-muted-foreground">{item.desc}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </motion.div>

//       {/* Footer */}
//       <motion.footer
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1, duration: 1 }}
//         className="mt-20"
//       >
//         <footer className="py-12 px-6 bg-gray-900 text-white rounded-t-2xl">
//           <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//             <div>
//               <h3 className="text-xl font-bold mb-4">Ultimi</h3>
//               <p className="text-gray-400">
//                 Your ultimate companion for exam preparation.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><Link href="#" className="hover:text-white">Start</Link></li>
//                 <li><Link href="#" className="hover:text-white">How It Works</Link></li>
//                 <li><Link href="#" className="hover:text-white">Pricing</Link></li>
//                 <li><Link href="#" className="hover:text-white">FAQ</Link></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4">Affiliation</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
//                 <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
//               </ul>
//               <SocialIcons />
//             </div>
//           </div>

//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
//             © {new Date().getFullYear()} Ultimi. All rights reserved.
//           </div>
//         </footer>
//       </motion.footer>
//     </Box>
//   )
// }



"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ModeToggle from "@/app/theme/page"
import Box from "@/components/ui/box"
import { Bot, Earth, NotebookText } from "lucide-react"

const SocialIcons = () => (
  <div className="parent flex justify-center space-x-4">
    <style jsx>{`
      .parent { width: 100%; display: flex; justify-content: center; align-items: center; }
      .child { width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; transition: all 0.5s ease-in-out; border-radius: 50%; margin: 0 5px; background: linear-gradient(45deg, var(--primary), var(--secondary)); }
      .child:hover { background-color: var(--background); transform: perspective(180px) rotateX(60deg) translateY(2px); box-shadow: 0px 10px 10px var(--primary); }
      .button { border: none; background-color: transparent; font-size: 20px; width: inherit; height: inherit; display: flex; justify-content: center; align-items: center; transform: translate3d(0px, 0px, 15px) perspective(180px) rotateX(-35deg) translateY(2px); border-radius: 50%; transition: all 0.5s ease-in-out; }
      .child:hover .button { background-color: var(--background); border-radius: 50%; }
    `}</style>
    <div className="child child-1">
      <button className="button btn-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="currentColor"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
      </button>
    </div>
    <div className="child child-2">
      <button className="button btn-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
      </button>
    </div>
    <div className="child child-3">
      <button className="button btn-3">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 496 512" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
      </button>
    </div>
    <div className="child child-4">
      <button className="button btn-4">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>
      </button>
    </div>
  </div>
)

// ====================
// Home Page Component
// ====================
export default function HomePage() {
  return (
    <Box className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background to-muted px-6">
      {/* Theme toggle */}
      <div className="absolute top-4 right-6">
        <ModeToggle />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center mt-16"
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to{" "}
          <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Ultimi
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-6">
          Generate, practice, and challenge yourself with AI-powered quizzes.
          Learn smarter, faster, and better.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="rounded-2xl shadow-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-gray-400"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl mx-auto"
      >
        {[
          {
            icon: <NotebookText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            title: "AI Quiz Generator",
            desc: "Upload notes or enter topics and instantly generate quizzes tailored to your needs.",
          },
          {
            icon: <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />,
            title: "Smart Practice",
            desc: "Adaptive question difficulty that grows with you as you improve.",
          },
          {
            icon: <Earth className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            title: "Study Anywhere",
            desc: "Responsive design so you can learn seamlessly on mobile, tablet, or desktop.",
          },
        ].map((item, i) => (
          <Card key={i} className="rounded-2xl shadow-md hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                {item.icon}
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

       {/* Footer */}

          <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="relative mt-20 bg-background text-foreground border-t border-border rounded-t-2xl shadow-inner"
        >
  <div className="max-w-6xl mx-auto py-10 px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
    {/* Brand */}
    <div>
      <h3 className="text-xl font-bold mb-2">Ultimi</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Your ultimate companion for exam preparation — study smart, not hard.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-base font-semibold mb-3">Quick Links</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><Link href="#" className="transition-colors hover:text-primary">Start</Link></li>
        <li><Link href="#" className="transition-colors hover:text-primary">How It Works</Link></li>
        <li><Link href="#" className="transition-colors hover:text-primary">Pricing</Link></li>
        <li><Link href="#" className="transition-colors hover:text-primary">FAQ</Link></li>
      </ul>
    </div>

    {/* Legal / Social */}
    <div>
      <h4 className="text-base font-semibold mb-3">Legal & Social</h4>
      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
        <li><Link href="#" className="transition-colors hover:text-primary">Terms & Conditions</Link></li>
        <li><Link href="#" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
      </ul>
      <SocialIcons />
    </div>
  </div>

  <div className="border-t border-border text-center text-xs text-muted-foreground py-4">
    © {new Date().getFullYear()} <span className="font-semibold text-foreground">Ultimi</span>. All rights reserved.
  </div>
</motion.footer>

    </Box>
  )
}
