import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import MotionBtn from './MotionBtn';

const Hero = () => {
  return (
    <section className="relative z-10 px-6 py-20 md:py-32 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium backdrop-blur-sm">
                  🚀 Your Developer Portfolio, Reimagined
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Build Your
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  Perfect Profile
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Dual-mode portfolio builder: Auto-generate from GitHub or craft your custom story.
                Showcase skills, projects, and achievements with style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MotionBtn variant='large'>
                  <a href="#modes">
                    Start Building
                  </a>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </MotionBtn>
              </div>
            </motion.div>
          </div>

          {/* 3D Card Showcase */}
          <motion.div
            className="relative -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Floating Cards */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
                animate={{ y: [0, -30, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full" />
                  <div>
                    <div className="h-3 bg-white/20 rounded w-24 mb-2" />
                    <div className="h-2 bg-white/10 rounded w-16" />
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-2 bg-white/10 rounded" style={{ width: `${100 - i * 10}%` }} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-0 w-64 h-80 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
                animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Github className="text-white/60 mb-4" size={32} />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-white/10 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero;