import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const LogModal = ({
    logForm,
    editingLog,
    handleUpdateLog,
    handleAddLog,
    setShowAddForm,
    setLogForm,
    getTechColor,
}) => {
    return(
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              className="bg-slate-900 rounded-3xl p-8 max-w-3xl w-full border border-white/10 shadow-2xl my-8"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-cyan-400" size={24} />
                  {editingLog ? 'Edit Log' : 'Add New Log'}
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={logForm.date}
                      onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Time Spent (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={logForm.time}
                      onChange={(e) => setLogForm({ ...logForm, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={logForm.title}
                    onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                    placeholder="What did you learn today?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags (press Enter to add)</label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, DSA..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setLogForm({ ...logForm, tags: [...logForm.tags, e.target.value.trim()] });
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {logForm.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getTechColor(tag)} flex items-center gap-2`}
                      >
                        {tag}
                        <button
                          onClick={() => setLogForm({ ...logForm, tags: logForm.tags.filter((_, idx) => idx !== i) })}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    value={logForm.content}
                    onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
                    placeholder="Describe your learning experience... (supports markdown formatting)"
                    rows={12}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Use # for headings, ** for bold, - for lists, ``` for code blocks
                  </p>
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
                  onClick={editingLog ? handleUpdateLog : handleAddLog}
                  disabled={!logForm.title}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingLog ? 'Update' : 'Add'} Log
                </button>
              </div>
            </motion.div>
          </motion.div>
    )
}

export default LogModal;