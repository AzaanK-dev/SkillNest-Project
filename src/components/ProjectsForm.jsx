import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Folder, Github, Globe, Plus, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from "react";
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const ProjectsForm = () => {
    const { data, addProject, updateProject, deleteProject } = useContext(ManualProfileContext);
    const projects = data.projects;

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: [], github: '', live: '' });

    const handleAddProject = () => {
        if (!projectForm.title || !projectForm.description) return;
        addProject(projectForm)
        resetForm();
    };

    const handleUpdateProject = () => {
        updateProject(editingProjectId, projectForm)
        resetForm();
    };

    const handleDeleteProject = (id) => {
        deleteProject(id);
    };

    const handleEditProject = (project) => {
        setEditingProjectId(project.id);
        setProjectForm({
            title: project.title,
            description: project.description,
            tech: project.tech || [],
            github: project.github || '',
            live: project.live || ''
        });
        setShowProjectForm(true);
    };
    const resetForm = () => {
        setEditingProjectId(null);
        setShowProjectForm(false);
        setNewProject({
            title: '',
            description: '',
            tech: [],
            github: '',
            live: '',
            image: '',
            status: 'Completed'
        });
    }
    return (
        <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Folder className="text-green-400" size={28} />
                    Projects
                </h2>
                <motion.button
                    onClick={() => {
                        setShowProjectForm(true);
                        setEditingProjectId(null);
                        setProjectForm({ title: '', description: '', tech: [], github: '', live: '' });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Add Project
                </motion.button>
            </div>

            {/* Project Form */}
            <AnimatePresence>
                {showProjectForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-white/5 rounded-2xl p-6 border border-green-500/30 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    placeholder="e.g., TaskFlow Pro"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    placeholder="Describe your project..."
                                    rows={3}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack (press Enter to add)</label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, MongoDB..."
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            setProjectForm({ ...projectForm, tech: [...projectForm.tech, e.target.value.trim()] });
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {projectForm.tech.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm flex items-center gap-2">
                                            {tech}
                                            <button
                                                onClick={() => setProjectForm({ ...projectForm, tech: projectForm.tech.filter((_, idx) => idx !== i) })}
                                                className="hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={projectForm.github}
                                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                                        placeholder="https://github.com/..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo URL</label>
                                    <input
                                        type="url"
                                        value={projectForm.live}
                                        onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                                        placeholder="https://demo.com"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowProjectForm(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingProjectId ? handleUpdateProject : handleAddProject}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingProjectId ? 'Update' : 'Add'} Project
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{project.title || 'Untitled Project'}</h3>
                                    <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                                    {project.tech.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {project.tech.map((tech, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-3 text-sm">
                                        {project.github && (
                                            <a href={project.github} className="text-slate-400 hover:text-cyan-400 flex items-center gap-1">
                                                <Github size={14} />
                                                Code
                                            </a>
                                        )}
                                        {project.live && (
                                            <a href={project.live} className="text-slate-400 hover:text-green-400 flex items-center gap-1">
                                                <Globe size={14} />
                                                Live
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                    <button
                                        onClick={() => handleEditProject(project)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} className="text-green-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project.id)}
                                        className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Folder size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No projects added yet. Click "Add Project" to showcase your work!</p>
                </div>
            )}
        </motion.div>
    )
}

export default ProjectsForm;