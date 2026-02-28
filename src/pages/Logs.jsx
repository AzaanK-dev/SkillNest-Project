import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, Calendar, Clock, Tag, 
  TrendingUp, Target, Award, Flame, Edit2, Trash2, Eye,
  X, ChevronDown, Sparkles, Code, Brain, Zap, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';
import LogModal from '../components/LogModal';
import LogDetail from '../components/LogDetail';
import { GithubProfileContext } from '../contextAPI/GithubProfileContext';
import { useNavigate } from 'react-router-dom';
import MotionBtn from '../components/MotionBtn';

const Logs = () => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const navigate = useNavigate();

  // Form state
  const {profile, activity} = useContext(GithubProfileContext);
  const githubLogs = activity.map(a => ({
    id: `gh-${a.date}`,
    date: a.date,
    timeSpent: a.commits,
    title: "GitHub Activity",
    tags: ["GitHub"],
    content: `${a.commits} commits`,
    streak: a.commits > 0,
    readOnly: true,
  }));

  const {data,addLog,updateLog,deleteLog,getWeeklyActivity} = useContext(ManualProfileContext);
  const manualLogs = data.logs;

  const logs = isManualMode ? manualLogs : githubLogs;
  
  // Calculate stats
  const totalLogs = logs.length;
  const totalHours = logs.reduce((acc, log) => acc + log.timeSpent, 0);
  const currentStreak = logs.filter(log => log.streak).length;
  
  const allTags = ['All', ...new Set(logs.flatMap(log => log.tags))];
  const tagCounts = logs.flatMap(log => log.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    const topSkill = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const activityData = getWeeklyActivity(logs);
    const filteredLogs = logs
      .filter(log => 
            log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      .filter(log => selectedTag === 'All' || log.tags.includes(selectedTag));
        
    const [logForm, setLogForm] = useState({
          date: new Date().toISOString().split('T')[0],
          time: '2',
          title: '',
          tags: [],
          content: ''
    });

    const emptyProfile = isManualMode ? !data?.info?.fullName : !profile?.name; 
    const ctaPath = isManualMode ? "/createManualProfile" : "/createGithubProfile";
    const ctaText = isManualMode ? "Connect Manual Profile" : "Create Github Profile";
    if(emptyProfile){
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="p-8 rounded-2xl border border-white/10 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-3">
              {isManualMode ? "Manual Profile Not Created" : "GitHub Profile Not Connected"}
            </h2>
            <p className="text-slate-400 mb-6">
              {isManualMode ? "Please create your manual profile to continue." : "Please connect your GitHub account to continue."}
            </p>
            <div className='flex flex-col justify-center items-center gap-4'>
            <MotionBtn
              variant="gradient"
              onClick={() => navigate(ctaPath)}
              >
              {ctaText}
            </MotionBtn>
            <MotionBtn
              variant="glass"
              onClick={() => setIsManualMode(!isManualMode)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              Switch Mode
            </MotionBtn>
            </div>
          </div>
        </div>
      );
    }

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
    setEditingLog(null);
    setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
    setShowAddForm(false);
  };

  const handleDeleteLog = (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      deleteLog(id);
      setSelectedLog(null);
    }
  };

  const handleEditLog = (log) => {
    setEditingLog(log.id);
    setLogForm({
      date: log.date,
      time: log.timeSpent.toString(),
      title: log.title,
      tags: log.tags,
      content: log.content
    });
    setShowAddForm(true);
  };
  
  const getTechColor = (tech) => {'bg-green-500/20 text-green-400 border-green-500/30'};

  const LogCard = ({ log, index }) => (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onClick={() => setSelectedLog(log)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} />
          </div>
  
          <div className="flex-1">
            {/* Title */}
            <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
              {log.repo ?? log.title}
            </h3>
  
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(log.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
  
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {log.commits !== undefined
                  ? log.commits === null
                    ? "commits hidden"
                    : `${log.commits} commits`
                  : `${log.timeSpent}h`}
              </span>
            </div>
          </div>
        </div>
  
        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(log);
            }}
            className="p-2 bg-white/10 hover:bg-cyan-500/20 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} className="text-cyan-400" />
          </button>
  
          {isManualMode && !log.repo && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditLog(log);
                }}
                className="p-2 bg-white/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={16} className="text-purple-400" />
              </button>
  
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLog(log.id);
                }}
                className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>
  
      {/* Tags (manual only) */}
      {log.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {log.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTechColor(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
  
      {/* Content */}
      <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
        {(log.message ?? log.content ?? "GitHub push event")
          .replace(/[#*`]/g, "")
          .substring(0, 150)}
        …
      </p>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Learning Logs</h1>
              <p className="text-slate-400 mt-1">
                {isManualMode ? 'Track your learning journey' : 'Auto-tracked from GitHub activity'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              {isManualMode ? '✏️ Manual Mode' : '🤖 Auto Mode'}
            </button>
            {isManualMode && (
              <motion.button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingLog(null);
                  setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Add Log
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <Flame className="text-orange-400" size={28} />
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-400">{currentStreak}</div>
                <div className="text-sm text-orange-300">Day Streak</div>
              </div>
            </div>
            <div className="text-xs text-orange-200/60">Keep it going! 🔥</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="text-cyan-400" size={28} />
              <div className="text-right">
                <div className="text-3xl font-bold text-cyan-400">{totalLogs}</div>
                <div className="text-sm text-cyan-300">Total Logs</div>
              </div>
            </div>
            <div className="text-xs text-cyan-200/60">Learning entries</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <Clock className="text-purple-400" size={28} />
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">{totalHours}h</div>
                <div className="text-sm text-purple-300">Hours Spent</div>
              </div>
            </div>
            <div className="text-xs text-purple-200/60">Time invested</div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <Award className="text-green-400" size={28} />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{topSkill}</div>
                <div className="text-sm text-green-300">Top Skill</div>
              </div>
            </div>
            <div className="text-xs text-green-200/60">Most practiced</div>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold">Weekly Activity</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Filter size={18} />
              {selectedTag === 'All' ? 'All Tags' : selectedTag}
              <ChevronDown size={16} className={`transition-transform ${showTagFilter ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTagFilter && (
                <motion.div
                  className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto min-w-[200px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setSelectedTag(tag); setShowTagFilter(false); }}
                      className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left whitespace-nowrap"
                    >
                      {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <LogCard key={log.id} log={log} index={index} />
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Brain size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-slate-400 text-lg">
              {searchQuery || selectedTag !== 'All' 
                ? 'No logs found matching your criteria'
                : 'No learning logs yet. Start your journey!'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Log Modal */}
      <AnimatePresence>
        {showAddForm && (
          <LogModal
            logForm={logForm}
            editingLog={editingLog}
            handleUpdateLog={handleUpdateLog}
            handleAddLog={handleAddLog}
            setShowAddForm={setShowAddForm}
            setLogForm={setLogForm}
            getTechColor={getTechColor}
          />
        )}
      </AnimatePresence>

      {/* View Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && !showAddForm && (
          <LogDetail
            isManualMode={isManualMode}
            selectedLog={selectedLog}
            setSelectedLog={setSelectedLog}
            getTechColor={getTechColor}
            handleEditLog={handleEditLog}
            handleDeleteLog={handleDeleteLog}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Logs;












// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   BookOpen, Plus, Search, Filter, Calendar, Clock, Tag, 
//   TrendingUp, Target, Award, Flame, Edit2, Trash2, Eye,
//   X, ChevronDown, Sparkles, Code, Brain, Zap, BarChart3
// } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const Logs = () => {
//   const [isManualMode, setIsManualMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedTag, setSelectedTag] = useState('All');
//   const [showTagFilter, setShowTagFilter] = useState(false);
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingLog, setEditingLog] = useState(null);

//   // Form state
//   const [logForm, setLogForm] = useState({
//     date: new Date().toISOString().split('T')[0],
//     time: '2',
//     title: '',
//     tags: [],
//     content: ''
//   });

//   // Mock data
//   const [logs, setLogs] = useState([
//     {
//       id: 1,
//       date: '2024-02-04',
//       timeSpent: 3,
//       title: 'Deep Dive into React Server Components',
//       tags: ['React', 'Next.js', 'Performance'],
//       content: `# React Server Components

// Today I explored the fundamentals of React Server Components and how they improve application performance.

// ## Key Learnings:
// - Server Components render on the server and send HTML to the client
// - Zero JavaScript bundle impact for Server Components
// - Can directly access backend resources (databases, file system)
// - Perfect for data fetching and static content

// ## Practical Application:
// Built a simple blog using RSC to fetch posts directly from a database without any client-side JavaScript overhead.

// ## Next Steps:
// - Explore Server Actions for mutations
// - Test streaming and Suspense boundaries
// - Benchmark performance improvements`,
//       streak: true
//     },
//     {
//       id: 2,
//       date: '2024-02-03',
//       timeSpent: 2.5,
//       title: 'Binary Search Tree Implementation',
//       tags: ['DSA', 'JavaScript', 'Trees'],
//       content: `# Binary Search Tree Deep Dive

// Implemented a complete BST with all major operations.

// ## Operations Implemented:
// - Insert: O(log n) average case
// - Search: O(log n) average case  
// - Delete: O(log n) with three cases
// - Traversal: Inorder, Preorder, Postorder

// \`\`\`javascript
// class TreeNode {
//   constructor(val) {
//     this.val = val;
//     this.left = null;
//     this.right = null;
//   }
// }
// \`\`\`

// ## Key Insights:
// The delete operation is tricky with three cases to handle. Understanding parent-child relationships is crucial.`,
//       streak: true
//     },
//     {
//       id: 3,
//       date: '2024-02-02',
//       timeSpent: 4,
//       title: 'Advanced TypeScript Generics',
//       tags: ['TypeScript', 'Advanced'],
//       content: `# Mastering TypeScript Generics

// Spent quality time understanding generic constraints and utility types.

// ## Topics Covered:
// - Generic functions and classes
// - Constraints with extends
// - Mapped types
// - Conditional types
// - Template literal types

// ## Real-world Example:
// Created a type-safe API client with automatic response typing based on endpoint configuration.

// This will dramatically improve type safety in our production codebase!`,
//       streak: true
//     },
//     {
//       id: 4,
//       date: '2024-02-01',
//       timeSpent: 1.5,
//       title: 'CSS Grid Layout Patterns',
//       tags: ['CSS', 'Design', 'Frontend'],
//       content: `# Modern CSS Grid Patterns

// Explored advanced grid techniques for responsive layouts.

// ## Patterns Learned:
// - RAM (Repeat, Auto, Minmax) technique
// - Named grid areas for semantic layouts
// - Implicit vs explicit grid
// - Grid template areas for complex layouts

// Created a dashboard layout that adapts beautifully from mobile to desktop without media queries!`,
//       streak: false
//     },
//     {
//       id: 5,
//       date: '2024-01-31',
//       timeSpent: 3,
//       title: 'Understanding Event Loop in JavaScript',
//       tags: ['JavaScript', 'Core Concepts'],
//       content: `# JavaScript Event Loop Explained

// Finally got a solid understanding of how async JavaScript really works.

// ## Key Concepts:
// - Call stack
// - Callback queue
// - Microtask queue (Promise callbacks)
// - Event loop coordination

// ## Mind-Blowing Realization:
// Microtasks (promises) have priority over macrotasks (setTimeout). This explains so many weird behaviors I've encountered!

// Visualized it with diagrams and code examples. Game changer.`,
//       streak: false
//     }
//   ]);

//   // Calculate stats
//   const totalLogs = logs.length;
//   const totalHours = logs.reduce((acc, log) => acc + log.timeSpent, 0);
//   const currentStreak = logs.filter(log => log.streak).length;
  
//   // Get all unique tags
//   const allTags = ['All', ...new Set(logs.flatMap(log => log.tags))];
  
//   // Top skill (most frequent tag)
//   const tagCounts = logs.flatMap(log => log.tags).reduce((acc, tag) => {
//     acc[tag] = (acc[tag] || 0) + 1;
//     return acc;
//   }, {});
//   const topSkill = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

//   // Activity data for chart
//   const activityData = [
//     { day: 'Mon', hours: 2.5 },
//     { day: 'Tue', hours: 3 },
//     { day: 'Wed', hours: 1.5 },
//     { day: 'Thu', hours: 4 },
//     { day: 'Fri', hours: 2 },
//     { day: 'Sat', hours: 3.5 },
//     { day: 'Sun', hours: 2 }
//   ];

//   // Filter logs
//   const filteredLogs = logs
//     .filter(log => 
//       log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       log.content.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter(log => selectedTag === 'All' || log.tags.includes(selectedTag));

//   const handleAddLog = () => {
//     if (!logForm.title) return;
//     const newLog = {
//       id: Date.now(),
//       date: logForm.date,
//       timeSpent: parseFloat(logForm.time),
//       title: logForm.title,
//       tags: logForm.tags,
//       content: logForm.content,
//       streak: true
//     };
//     setLogs([newLog, ...logs]);
//     setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
//     setShowAddForm(false);
//   };

//   const handleUpdateLog = () => {
//     setLogs(logs.map(l => 
//       l.id === editingLog 
//         ? { ...l, ...logForm, timeSpent: parseFloat(logForm.time) }
//         : l
//     ));
//     setEditingLog(null);
//     setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
//     setShowAddForm(false);
//   };

//   const handleDeleteLog = (id) => {
//     if (window.confirm('Are you sure you want to delete this log?')) {
//       setLogs(logs.filter(l => l.id !== id));
//       setSelectedLog(null);
//     }
//   };

//   const handleEditLog = (log) => {
//     setEditingLog(log.id);
//     setLogForm({
//       date: log.date,
//       time: log.timeSpent.toString(),
//       title: log.title,
//       tags: log.tags,
//       content: log.content
//     });
//     setShowAddForm(true);
//   };

//   const getTechColor = (tech) => {
//     const colors = {
//       'React': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
//       'JavaScript': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//       'TypeScript': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//       'CSS': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
//       'DSA': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
//       'Next.js': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
//     };
//     return colors[tech] || 'bg-green-500/20 text-green-400 border-green-500/30';
//   };

//   const LogCard = ({ log, index }) => (
//     <motion.div
//       className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.05 }}
//       whileHover={{ y: -5 }}
//       onClick={() => setSelectedLog(log)}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-4 flex-1">
//           <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
//             <BookOpen size={24} />
//           </div>
//           <div className="flex-1">
//             <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
//               {log.title}
//             </h3>
//             <div className="flex items-center gap-3 text-sm text-slate-400">
//               <span className="flex items-center gap-1">
//                 <Calendar size={14} />
//                 {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Clock size={14} />
//                 {log.timeSpent}h
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button
//             onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
//             className="p-2 bg-white/10 hover:bg-cyan-500/20 rounded-lg transition-colors"
//             title="View"
//           >
//             <Eye size={16} className="text-cyan-400" />
//           </button>
//           {isManualMode && (
//             <>
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleEditLog(log); }}
//                 className="p-2 bg-white/10 hover:bg-purple-500/20 rounded-lg transition-colors"
//                 title="Edit"
//               >
//                 <Edit2 size={16} className="text-purple-400" />
//               </button>
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleDeleteLog(log.id); }}
//                 className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 size={16} className="text-red-400" />
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Tags */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {log.tags.map((tag, i) => (
//           <span
//             key={i}
//             className={`px-3 py-1 rounded-full text-xs font-medium border ${getTechColor(tag)}`}
//           >
//             {tag}
//           </span>
//         ))}
//       </div>

//       {/* Content Preview */}
//       <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
//         {log.content.replace(/[#*`]/g, '').substring(0, 150)}...
//       </p>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6">
//       {/* Background Effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
//               <Brain size={32} />
//             </div>
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold">Learning Logs</h1>
//               <p className="text-slate-400 mt-1">
//                 {isManualMode ? 'Track your learning journey' : 'Auto-tracked from GitHub activity'}
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={() => setIsManualMode(!isManualMode)}
//               className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
//             >
//               {isManualMode ? '✏️ Manual Mode' : '🤖 Auto Mode'}
//             </button>
//             {isManualMode && (
//               <motion.button
//                 onClick={() => {
//                   setShowAddForm(true);
//                   setEditingLog(null);
//                   setLogForm({ date: new Date().toISOString().split('T')[0], time: '2', title: '', tags: [], content: '' });
//                 }}
//                 className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Plus size={20} />
//                 Add Log
//               </motion.button>
//             )}
//           </div>
//         </motion.div>

//         {/* Top Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <motion.div
//             className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <Flame className="text-orange-400" size={28} />
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-orange-400">{currentStreak}</div>
//                 <div className="text-sm text-orange-300">Day Streak</div>
//               </div>
//             </div>
//             <div className="text-xs text-orange-200/60">Keep it going! 🔥</div>
//           </motion.div>

//           <motion.div
//             className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <BookOpen className="text-cyan-400" size={28} />
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-cyan-400">{totalLogs}</div>
//                 <div className="text-sm text-cyan-300">Total Logs</div>
//               </div>
//             </div>
//             <div className="text-xs text-cyan-200/60">Learning entries</div>
//           </motion.div>

//           <motion.div
//             className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <Clock className="text-purple-400" size={28} />
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-purple-400">{totalHours}h</div>
//                 <div className="text-sm text-purple-300">Hours Spent</div>
//               </div>
//             </div>
//             <div className="text-xs text-purple-200/60">Time invested</div>
//           </motion.div>

//           <motion.div
//             className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <Award className="text-green-400" size={28} />
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-green-400">{topSkill}</div>
//                 <div className="text-sm text-green-300">Top Skill</div>
//               </div>
//             </div>
//             <div className="text-xs text-green-200/60">Most practiced</div>
//           </motion.div>
//         </div>

//         {/* Activity Chart */}
//         <motion.div
//           className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.5 }}
//         >
//           <div className="flex items-center gap-3 mb-6">
//             <BarChart3 className="text-cyan-400" size={24} />
//             <h2 className="text-2xl font-bold">Weekly Activity</h2>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={activityData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//               <XAxis dataKey="day" stroke="#94a3b8" />
//               <YAxis stroke="#94a3b8" />
//               <Tooltip 
//                 contentStyle={{ 
//                   backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '12px',
//                   backdropFilter: 'blur(10px)'
//                 }}
//                 labelStyle={{ color: '#e2e8f0' }}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="hours" 
//                 stroke="#06b6d4" 
//                 strokeWidth={3}
//                 dot={{ fill: '#06b6d4', r: 5 }}
//                 activeDot={{ r: 7 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           className="flex flex-col md:flex-row gap-4 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//         >
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search logs..."
//               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
//             />
//           </div>

//           <div className="relative">
//             <button
//               onClick={() => setShowTagFilter(!showTagFilter)}
//               className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
//             >
//               <Filter size={18} />
//               {selectedTag === 'All' ? 'All Tags' : selectedTag}
//               <ChevronDown size={16} className={`transition-transform ${showTagFilter ? 'rotate-180' : ''}`} />
//             </button>

//             <AnimatePresence>
//               {showTagFilter && (
//                 <motion.div
//                   className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto min-w-[200px]"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                 >
//                   {allTags.map((tag) => (
//                     <button
//                       key={tag}
//                       onClick={() => { setSelectedTag(tag); setShowTagFilter(false); }}
//                       className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left whitespace-nowrap"
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>

//         {/* Logs List */}
//         <div className="space-y-4">
//           {filteredLogs.map((log, index) => (
//             <LogCard key={log.id} log={log} index={index} />
//           ))}
//         </div>

//         {filteredLogs.length === 0 && (
//           <motion.div
//             className="text-center py-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <Brain size={64} className="mx-auto mb-4 opacity-30" />
//             <p className="text-slate-400 text-lg">
//               {searchQuery || selectedTag !== 'All' 
//                 ? 'No logs found matching your criteria'
//                 : 'No learning logs yet. Start your journey!'}
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* Add/Edit Log Modal */}
//       <AnimatePresence>
//         {showAddForm && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setShowAddForm(false)}
//           >
//             <motion.div
//               className="bg-slate-900 rounded-3xl p-8 max-w-3xl w-full border border-white/10 shadow-2xl my-8"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold flex items-center gap-2">
//                   <Sparkles className="text-cyan-400" size={24} />
//                   {editingLog ? 'Edit Log' : 'Add New Log'}
//                 </h2>
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
//                     <input
//                       type="date"
//                       value={logForm.date}
//                       onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Time Spent (hours)</label>
//                     <input
//                       type="number"
//                       step="0.5"
//                       min="0"
//                       value={logForm.time}
//                       onChange={(e) => setLogForm({ ...logForm, time: e.target.value })}
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
//                   <input
//                     type="text"
//                     value={logForm.title}
//                     onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
//                     placeholder="What did you learn today?"
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Tags (press Enter to add)</label>
//                   <input
//                     type="text"
//                     placeholder="React, TypeScript, DSA..."
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' && e.target.value.trim()) {
//                         setLogForm({ ...logForm, tags: [...logForm.tags, e.target.value.trim()] });
//                         e.target.value = '';
//                       }
//                     }}
//                   />
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {logForm.tags.map((tag, i) => (
//                       <span
//                         key={i}
//                         className={`px-3 py-1 rounded-full text-sm font-medium border ${getTechColor(tag)} flex items-center gap-2`}
//                       >
//                         {tag}
//                         <button
//                           onClick={() => setLogForm({ ...logForm, tags: logForm.tags.filter((_, idx) => idx !== i) })}
//                           className="hover:text-red-400 transition-colors"
//                         >
//                           <X size={14} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">
//                     Content (Markdown supported)
//                   </label>
//                   <textarea
//                     value={logForm.content}
//                     onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
//                     placeholder="Describe your learning experience... (supports markdown formatting)"
//                     rows={12}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none font-mono text-sm"
//                   />
//                   <p className="text-xs text-slate-500 mt-2">
//                     Use # for headings, ** for bold, - for lists, ``` for code blocks
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors font-semibold"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={editingLog ? handleUpdateLog : handleAddLog}
//                   disabled={!logForm.title}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {editingLog ? 'Update' : 'Add'} Log
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* View Log Detail Modal */}
//       <AnimatePresence>
//         {selectedLog && !showAddForm && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedLog(null)}
//           >
//             <motion.div
//               className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden my-8"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-white/10 p-8">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h2 className="text-3xl font-bold mb-3">{selectedLog.title}</h2>
//                     <div className="flex items-center gap-4 text-sm text-slate-300">
//                       <span className="flex items-center gap-2">
//                         <Calendar size={16} className="text-cyan-400" />
//                         {new Date(selectedLog.date).toLocaleDateString('en-US', { 
//                           weekday: 'long',
//                           year: 'numeric', 
//                           month: 'long', 
//                           day: 'numeric' 
//                         })}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <Clock size={16} className="text-purple-400" />
//                         {selectedLog.timeSpent} hours
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setSelectedLog(null)}
//                     className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-2">
//                   {selectedLog.tags.map((tag, i) => (
//                     <span
//                       key={i}
//                       className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTechColor(tag)}`}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-8">
//                 <div className="prose prose-invert prose-cyan max-w-none">
//                   {selectedLog.content.split('\n').map((line, i) => {
//                     // Simple markdown rendering
//                     if (line.startsWith('# ')) {
//                       return <h1 key={i} className="text-3xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
//                     } else if (line.startsWith('## ')) {
//                       return <h2 key={i} className="text-2xl font-bold mb-3 mt-5">{line.substring(3)}</h2>;
//                     } else if (line.startsWith('### ')) {
//                       return <h3 key={i} className="text-xl font-bold mb-2 mt-4">{line.substring(4)}</h3>;
//                     } else if (line.startsWith('- ')) {
//                       return <li key={i} className="ml-6 mb-2 text-slate-300">{line.substring(2)}</li>;
//                     } else if (line.startsWith('```')) {
//                       return null; // Skip code fence markers
//                     } else if (line.trim() === '') {
//                       return <br key={i} />;
//                     } else {
//                       return <p key={i} className="mb-3 text-slate-300 leading-relaxed">{line}</p>;
//                     }
//                   })}
//                 </div>
//               </div>

//               {/* Footer Actions */}
//               {isManualMode && (
//                 <div className="bg-white/5 border-t border-white/10 p-6 flex gap-3">
//                   <button
//                     onClick={() => {
//                       setSelectedLog(null);
//                       handleEditLog(selectedLog);
//                     }}
//                     className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
//                   >
//                     <Edit2 size={18} />
//                     Edit Log
//                   </button>
//                   <button
//                     onClick={() => handleDeleteLog(selectedLog.id)}
//                     className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-semibold flex items-center gap-2"
//                   >
//                     <Trash2 size={18} />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Logs;