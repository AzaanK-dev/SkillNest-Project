import { motion } from 'framer-motion';
import { ExternalLink, Folder, Github, Globe, Star } from 'lucide-react';

const ProjectCard = ({ project, index }) => (
    <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group h-full flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Folder className="text-cyan-400" size={20} />
                    <h3 className="text-xl font-bold">{project.title}</h3>
                </div>
                {project.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                        <Star size={12} fill="currentColor" />
                        Featured
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 text-slate-400">
                <Star size={16} />
                <span className="text-sm">{project.stars}</span>
            </div>
        </div>

        <p className="text-slate-300 mb-4 flex-1 leading-relaxed">
            {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                    {tech}
                </span>
            ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
            <a
                href={project.github}
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm group/link"
            >
                <Github size={16} />
                <span>Code</span>
                <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
            {project.live && (
                <a
                    href={project.live}
                    className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors text-sm group/link"
                >
                    <Globe size={16} />
                    <span>Live Demo</span>
                    <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
            )}
        </div>
    </motion.div>
);

export default ProjectCard;