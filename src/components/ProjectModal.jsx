import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const ProjectModal = ({
  editingProject,
  newProject,
  setNewProject,
  setShowAddForm,
  handleAddProject,
  handleUpdateProject,
  handleAddTech,
  handleRemoveTech
}
)=>{
    return(
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl my-8"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-cyan-400" size={24} />
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g., TaskFlow Pro"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add technology..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTech(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button
                          onClick={() => handleRemoveTech(tech)}
                          className="hover:text-red-400 transition-colors"
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
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProject.live}
                      onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                      placeholder="https://demo.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image URL (optional)</label>
                  <input
                    type="url"
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                  disabled={!newProject.title || !newProject.description}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProject ? 'Update' : 'Add'} Project
                </button>
              </div>
            </motion.div>
          </motion.div>
    )
}

export default ProjectModal;