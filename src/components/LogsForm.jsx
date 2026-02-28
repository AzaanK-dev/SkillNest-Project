import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Calendar, Edit2, Plus, Trash2 } from 'lucide-react';
import { useContext, useState } from "react";
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const LogsForm = () => {
    const {data,addLog,updateLog,deleteLog} = useContext(ManualProfileContext);
    const logs = data.logs;

    const [showLogForm, setShowLogForm] = useState(false);
    const [editingLogId, setEditingLogId] = useState(null);
    const [logForm, setLogForm] = useState({
        date: new Date().toISOString().split('T')[0],
        time: '2',
        title: '',
        tags: [],
        content: ''
    });
    const handleAddLog = () => {
        if (!logForm.title) return;
        addLog({
            date: logForm.date,
            timeSpent: logForm.time,
            title: logForm.title,
            tags: logForm.tags,
            content: logForm.content,
            streak: true
        });
        setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
        setShowAddForm(false);
    };

    const handleUpdateLog = () => {
        updateLog(editingLog, {
            date: logForm.date,
            timeSpent: logForm.time,
            title: logForm.title,
            tags: logForm.tags,
            content: logForm.content
        });
        setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
        setEditingLogId(null);
        setShowLogForm(false);
    };

    const handleDeleteLog = (id) => {
        deleteLog(id);
    };

    const handleEditLog = (log) => {
        setEditingLogId(log.id);
        setLogForm({
            date: log.date,
            time: log.timeSpent.toString(),
            title: log.title,
            tags: log.tags,
            content: log.content
        });
        setShowLogForm(true);
    };
    
    return (
        <motion.div
            key="logs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <BookOpen className="text-yellow-400" size={28} />
                    Learning Logs
                </h2>
                <motion.button
                    onClick={() => {
                        setShowLogForm(true);
                        setEditingLogId(null);
                        setLogForm({ date: new Date().toISOString().split('T')[0], title: '', tags: [], content: '' });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Add Log
                </motion.button>
            </div>

            {/* Log Form */}
            <AnimatePresence>
                {showLogForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-white/5 rounded-2xl p-6 border border-yellow-500/30 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={logForm.date}
                                        onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={logForm.title}
                                        onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                                        placeholder="What did you learn?"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (press Enter to add)</label>
                                <input
                                    type="text"
                                    placeholder="React, TypeScript, Hooks..."
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            setLogForm({ ...logForm, tags: [...logForm.tags, e.target.value.trim()] });
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {logForm.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm flex items-center gap-2">
                                            {tag}
                                            <button
                                                onClick={() => setLogForm({ ...logForm, tags: logForm.tags.filter((_, idx) => idx !== i) })}
                                                className="hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                                <textarea
                                    value={logForm.content}
                                    onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
                                    placeholder="Describe what you learned today..."
                                    rows={4}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogForm(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingLogId ? handleUpdateLog : handleAddLog}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingLogId ? 'Update' : 'Add'} Log
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logs List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {logs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="text-yellow-400" size={16} />
                                        <span className="text-sm text-slate-400">{new Date(log.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{log.title}</h3>
                                    {log.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {log.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-slate-300 text-sm">{log.content}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                    <button
                                        onClick={() => handleEditLog(log)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} className="text-yellow-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLog(log.id)}
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

            {logs.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No learning logs yet. Start tracking your progress!</p>
                </div>
            )}
        </motion.div>
    )
}

export default LogsForm;