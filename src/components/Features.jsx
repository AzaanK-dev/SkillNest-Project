import { motion } from 'framer-motion';
import { Award, Code, Download, Github, TrendingUp, User } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="relative z-10 px-6 py-20 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to create a standout developer portfolio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Download className="text-cyan-400" size={32} />,
              title: "ATS-Friendly CV",
              description: "Download a professionally formatted ATS-compatible resume directly from my GitHub repository."
            },
            {
              icon: <Code className="text-purple-400" size={32} />,
              title: "Developer First",
              description: "Made by developers, for developers. Intuitive workflows that just make sense."
            },
            {
              icon: <TrendingUp className="text-pink-400" size={32} />,
              title: "Analytics Ready",
              description: "Track your profile views with built-in analytics using Recharts."
            },
            {
              icon: <Award className="text-yellow-400" size={32} />,
              title: "Showcase Projects",
              description: "Highlight your best work with rich project cards and live demos."
            },
            {
              icon: <Github className="text-slate-400" size={32} />,
              title: "GitHub Integration",
              description: "Seamlessly pull your repos, contributions, and stats directly from GitHub."
            },
            {
              icon: <User className="text-green-400" size={32} />,
              title: "Custom Profiles",
              description: "Full control to manually craft your unique developer story."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:ring-2 hover:ring-cyan-400/60 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >

              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-600/0 group-hover:from-cyan-500/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features;