import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left, rgba(99,102,241,0.15) 0%, transparent 50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right, rgba(139,92,246,0.15) 0%, transparent 50%)]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center max-w-4xl space-y-6"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Welcome to the Future of AI
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-2xl">
            Discover cutting-edge AI solutions powered by NVIDIA's latest technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform"
            >
              Explore Solutions
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export const metadata = {
  title: 'NVIDIA Landing Page – Future of AI',
  description: 'A minimal landing page with a hero section and call-to-action button.',
};