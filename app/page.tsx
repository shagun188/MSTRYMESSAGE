"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold flex items-center gap-2">
            Welcome to True Feedback <Target className="text-blue-400 w-8 h-8" />
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            Send and receive anonymous messages securely — in a safe and simple way.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-xl shadow-md transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>

          <Link href="/signin">
            <Button
              variant="outline"
              className="border-gray-500 text-gray-200 hover:bg-gray-800 px-6 py-3 text-lg rounded-xl transition-all hover:scale-105"
            >
              Sign In
            </Button>
          </Link>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 pt-8"
        >
          © {new Date().getFullYear()} True Feedback. All rights reserved.
        </motion.footer>
      </motion.div>
    </main>
  );
}
