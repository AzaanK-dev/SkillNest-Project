import { motion } from 'framer-motion';
import { ArrowRight, Github, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Modes = ()=>{
  const navigate = useNavigate(); 
    return(
        <section id="modes" className="relative z-10 px-6 py-20 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Two Powerful Modes
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Choose how you want to build your portfolio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* GitHub Auto Profile */}
            <motion.div
              className="relative bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-500/30 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Github size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">GitHub Auto Profile</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Simply enter your GitHub username and watch your profile come to life. 
                  We automatically fetch your repositories, contributions, and stats.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Automatic repo import",
                    "Live contribution graphs",
                    "Language statistics",
                    "Instant updates"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  onClick={(()=>navigate("createGithubProfile"))}
                >
                  Try GitHub Mode
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Manual Profile */}
            <motion.div
              className="relative bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <User size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Manual Profile</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Take full control and craft your story exactly how you want it. 
                  Add skills, projects, experience, and achievements manually.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Custom project entries",
                    "Skill categorization",
                    "Achievement tracking",
                    "Personal branding"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  onClick={(()=>navigate("createManualProfile"))}
                >
                  Try Manual Mode
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    )
}

export default Modes;