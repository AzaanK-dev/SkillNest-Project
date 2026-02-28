import { AnimatePresence, motion } from 'framer-motion';
import { Award, Code, Edit2, Plus, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const SkillForm = () => {
  const { data, addSkill, updateSkill, deleteSkill } = useContext(ManualProfileContext);
  const skills = data.skills;
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: '💻',
    level: 50,
    category: 'Frontend'
  });

  const getSkillLevel = (level) => {
    if (level >= 80) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const handleAddSkill = () => {
    if (!skillForm.name) return;
    addSkill(skillForm, getSkillLevel);
    resetForm();
  };

  const handleUpdateSkill = () => {
    updateSkill(editingSkillId, skillForm, getSkillLevel);
    resetForm();
  };

  const handleDeleteSkill = (id) => {
    deleteSkill(id);
  };

  const handleEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category
    });
    setShowSkillForm(true);
  };

  const resetForm = () => {
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      icon: '💻',
      level: 50,
      category: 'Frontend'
    });
    setShowSkillForm(false);
  };

  return (
    <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Award className="text-cyan-400" size={28} />
                    Skills
                </h2>
                <motion.button
                    onClick={() => {
                        setShowSkillForm(true);
                        setEditingSkillId(null);
                        setSkillForm({ name: '', icon: '💻', level: 50, category: 'Frontend' });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Add Skill
                </motion.button>
            </div>
    
            {/* Skill Form */}
            <AnimatePresence>
                {showSkillForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-white/5 rounded-2xl p-6 border border-cyan-500/30">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name *</label>
                                    <input
                                        type="text"
                                        value={skillForm.name}
                                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                                        placeholder="e.g., React"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        value={skillForm.icon}
                                        onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                                        placeholder="⚛️"
                                        maxLength={2}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                <select
                                    value={skillForm.category}
                                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Level: {skillForm.level}% ({getSkillLevel(skillForm.level)})
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={skillForm.level}
                                    onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${skillForm.level}%, rgba(255,255,255,0.1) ${skillForm.level}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSkillForm(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingSkillId ? handleUpdateSkill : handleAddSkill}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingSkillId ? 'Update' : 'Add'} Skill
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
    
            {/* Skills List */}
            <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{skill.icon}</span>
                                    <div>
                                        <h3 className="font-bold">{skill.name}</h3>
                                        <span className="text-xs text-slate-400">{skill.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditSkill(skill)}
                                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} className="text-cyan-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{getSkillLevel(skill.level)}</span>
                                    <span className="text-cyan-400 font-bold">{skill.level}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.level}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.05 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {skills.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Code size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No skills added yet. Click "Add Skill" to get started!</p>
                </div>
            )}
        </motion.div>
  );
};

export default SkillForm;
