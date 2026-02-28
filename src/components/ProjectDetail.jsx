import { motion } from 'framer-motion';
import { Calendar, ExternalLink, GitFork, Github, Globe, Star, Tag, X } from 'lucide-react';

const ProjectDetail = ({
    selectedProject,
    setSelectedProject,
    getTechColor,
    getStatusColor
})=>{
    return(
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden my-8"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProject.image && (
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <div className="p-8">
                {!selectedProject.image && (
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {selectedProject.image && (
                  <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
                )}

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                  {selectedProject.featured && (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Featured
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(selectedProject.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Star size={16} />
                      <span className="text-sm">Stars</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedProject.stars}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <GitFork size={16} />
                      <span className="text-sm">Forks</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedProject.forks}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Github size={20} />
                      View Code
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Globe size={20} />
                      Live Demo
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
    )
}
export default ProjectDetail;