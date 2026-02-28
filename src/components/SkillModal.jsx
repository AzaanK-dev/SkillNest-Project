import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const SkillModal = ({
    newSkill,
    setNewSkill,
    editingSkill,
    handleAddSkill,
    handleUpdateSkill,
    setShowAddForm,
    getSkillLevel
}) => {

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
        >
            <motion.div
                className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-cyan-400" size={24} />
                        {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h2>
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
                        <input
                            type="text"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                            placeholder="e.g, React"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Icon (Url)</label>
                        <input
                            type="url"
                            value={newSkill.icon}
                            onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                            placeholder="e.g. https://reacticon.com/"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                        <select
                            value={newSkill.category}
                            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Language">Language</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Cloud">Cloud</option>
                            <option value="Tools">Tools</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Skill Level: {newSkill.level}% ({getSkillLevel(newSkill.level)})
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={newSkill.level}
                            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${newSkill.level}%, rgba(255,255,255,0.1) ${newSkill.level}%, rgba(255,255,255,0.1) 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Advanced</span>
                        </div>
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
                        onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
                    >
                        {editingSkill ? 'Update' : 'Add'} Skill
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default SkillModal;
