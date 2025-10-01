import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-slate-700">
      <motion.h1
        className="text-4xl font-bold text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hello Chief 🧐, get ready to build!!!
      </motion.h1>
    </div>
  );
}
