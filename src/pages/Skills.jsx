import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Search, Plus, X, Edit2, Trash2, TrendingUp, 
  Filter, ChevronDown, Sparkles, Code, BarChart3, Target,
  Loader
} from 'lucide-react';
import SkillModal from '../components/SkillModal';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';
import { GithubProfileContext } from '../contextAPI/GithubProfileContext';
import MotionBtn from '../components/MotionBtn';
import { useNavigate } from 'react-router-dom';

const Skills = () => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('level'); // 'level', 'name', 'recent'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const navigate = useNavigate();

  const { profile, skills:githubContSkills,isLoading } = useContext(GithubProfileContext)
  const [githubSkills, setGithubSkills] = useState([])
  useEffect(()=>{
    if(!isManualMode){
      setGithubSkills(githubContSkills)
    }
  },[isManualMode,githubContSkills])

  // Form state
  const { data, addSkill, updateSkill, deleteSkill } = useContext(ManualProfileContext);
  const skills = isManualMode ? data.skills: githubSkills;
  const [newSkill, setNewSkill] = useState({
    name: '',
    icon: '',
    level: 50,
    category: 'Frontend'
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

  const handleAddSkill = () => {
    if (!newSkill.name) return;
    addSkill(newSkill, getSkillLevel);
    setNewSkill({ name: '', icon: '', level: 50, category: 'Frontend' });
    setShowAddForm(false);
    setEditingSkill(null);
  };
  
  const handleEditSkill = (skill) => {
    setEditingSkill(skill.id);
    setNewSkill({
      name: skill.name,
      icon: skill.icon?.startsWith('http') ? skill.icon : '',
      level: skill.level,
      category: skill.category
    });
    setShowAddForm(true);
  };
  
  const handleUpdateSkill = () => {
    updateSkill(editingSkill, newSkill, getSkillLevel);
    setEditingSkill(null);
    setNewSkill({ name: '', icon: '', level: 50, category: 'Frontend' });
    setShowAddForm(false);
    setEditingSkill(null);
  };
  
  const handleDeleteSkill = (id) => {
    deleteSkill(id);
  };
  
  const getSkillLevel = (level) => {
      if (level >= 80) return 'Advanced';
      if (level >= 50) return 'Intermediate';
      return 'Beginner';
  };
  const getProgressColor = (level) => {
      if (level >= 80) return 'from-cyan-500 to-blue-600';
      if (level >= 50) return 'from-purple-500 to-pink-600';
      return 'from-green-500 to-emerald-600';
  };
    

  if (!isManualMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <Loader className='animate-spin'/>
        <p>Please Wait!</p>
      </div>
    );
  }
    // Filter and sort
  const filteredSkills = skills
  .filter(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => {
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const averageLevel = Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length);

  const SkillCard = ({ skill, index }) => (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-600/0 group-hover:from-cyan-500/5 group-hover:to-purple-600/5 transition-all duration-300 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isManualMode ? 
              <div className="text-4xl">{skill.icon}</div>:
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-3xl">
                {skill.name.charAt(0).toUpperCase()}
              </div>
            }
            <div>
              <h3 className="text-xl font-bold">{skill.name}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                skill.level >= 80 ? 'bg-cyan-500/20 text-cyan-400' :
                skill.level >= 50 ? 'bg-purple-500/20 text-purple-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {skill.experience}
              </span>
            </div>
          </div>
          
          {isManualMode && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditSkill(skill)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Edit2 size={16} className="text-cyan-400" />
              </button>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{skill.category}</span>
            <span className="font-bold text-cyan-400">{skill.level}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getProgressColor(skill.level)} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
            />
          </div>
        </div>
      </div>
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
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Award size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Your Skills</h1>
                <p className="text-slate-400 mt-1">
                  {isManualMode ? 'Manage your skill set' : 'Inferred from your repositories'}
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              {isManualMode ? '✏️ Manual Mode' : '🤖 Auto Mode'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Skills</p>
                  <p className="text-3xl font-bold text-cyan-400">{skills.length}</p>
                </div>
                <Code className="text-cyan-400" size={32} />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Average Level</p>
                  <p className="text-3xl font-bold text-purple-400">{averageLevel}%</p>
                </div>
                <BarChart3 className="text-purple-400" size={32} />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Advanced Skills</p>
                  <p className="text-3xl font-bold text-pink-400">
                    {skills.filter(s => s.level >= 80).length}
                  </p>
                </div>
                <Target className="text-pink-400" size={32} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Filter size={18} />
              Sort by: {sortBy === 'level' ? 'Level' : 'Name'}
              <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={() => { setSortBy('level'); setShowSortMenu(false); }}
                    className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    By Level
                  </button>
                  <button
                    onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                    className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    By Name
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Button */}
          {isManualMode && (
            <motion.button
              onClick={() => {
                setShowAddForm(true);
                setEditingSkill(null);
                setNewSkill({ name: '', icon: '⚛️', level: 50, category: 'Frontend' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add Skill
            </motion.button>
          )}
        </motion.div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
        {showAddForm && (
          <SkillModal
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            editingSkill={editingSkill}
            handleAddSkill={handleAddSkill}
            handleUpdateSkill={handleUpdateSkill}
            setShowAddForm={setShowAddForm}
            getSkillLevel={getSkillLevel}
          />
        )}
        </AnimatePresence>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-400 text-lg">No skills found matching "{searchQuery}"</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Skills;























// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Award, Search, Plus, X, Edit2, Trash2, TrendingUp, 
//   Filter, ChevronDown, Sparkles, Code, BarChart3, Target
// } from 'lucide-react';

// const Skills = () => {
//   const [isManualMode, setIsManualMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('level'); // 'level', 'name', 'recent'
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingSkill, setEditingSkill] = useState(null);
//   const [showSortMenu, setShowSortMenu] = useState(false);

//   // Form state
//   const [newSkill, setNewSkill] = useState({
//     name: '',
//     icon: '⚛️',
//     level: 50,
//     category: 'Frontend'
//   });

//   const [skills, setSkills] = useState([
//     { id: 1, name: 'React', icon: '⚛️', level: 90, category: 'Frontend', experience: 'Advanced' },
//     { id: 2, name: 'TypeScript', icon: '📘', level: 85, category: 'Language', experience: 'Advanced' },
//     { id: 3, name: 'Node.js', icon: '🟢', level: 80, category: 'Backend', experience: 'Advanced' },
//     { id: 4, name: 'Python', icon: '🐍', level: 75, category: 'Language', experience: 'Intermediate' },
//     { id: 5, name: 'AWS', icon: '☁️', level: 70, category: 'Cloud', experience: 'Intermediate' },
//     { id: 6, name: 'Docker', icon: '🐳', level: 65, category: 'DevOps', experience: 'Intermediate' },
//     { id: 7, name: 'PostgreSQL', icon: '🐘', level: 75, category: 'Database', experience: 'Intermediate' },
//     { id: 8, name: 'GraphQL', icon: '💠', level: 60, category: 'API', experience: 'Intermediate' },
//     { id: 9, name: 'Next.js', icon: '▲', level: 85, category: 'Frontend', experience: 'Advanced' },
//     { id: 10, name: 'Tailwind CSS', icon: '🎨', level: 90, category: 'Styling', experience: 'Advanced' },
//     { id: 11, name: 'MongoDB', icon: '🍃', level: 70, category: 'Database', experience: 'Intermediate' },
//     { id: 12, name: 'Git', icon: '🔀', level: 80, category: 'Tools', experience: 'Advanced' },
//   ]);

//   const getSkillLevel = (level) => {
//     if (level >= 80) return 'Advanced';
//     if (level >= 50) return 'Intermediate';
//     return 'Beginner';
//   };

//   const getProgressColor = (level) => {
//     if (level >= 80) return 'from-cyan-500 to-blue-600';
//     if (level >= 50) return 'from-purple-500 to-pink-600';
//     return 'from-green-500 to-emerald-600';
//   };

//   const handleAddSkill = () => {
//     if (!newSkill.name) return;
//     const skill = {
//       id: Date.now(),
//       ...newSkill,
//       experience: getSkillLevel(newSkill.level)
//     };
//     setSkills([...skills, skill]);
//     setNewSkill({ name: '', icon: '⚛️', level: 50, category: 'Frontend' });
//     setShowAddForm(false);
//   };

//   const handleEditSkill = (skill) => {
//     setEditingSkill(skill.id);
//     setNewSkill({
//       name: skill.name,
//       icon: skill.icon,
//       level: skill.level,
//       category: skill.category
//     });
//     setShowAddForm(true);
//   };

//   const handleUpdateSkill = () => {
//     setSkills(skills.map(s => 
//       s.id === editingSkill 
//         ? { ...s, ...newSkill, experience: getSkillLevel(newSkill.level) }
//         : s
//     ));
//     setEditingSkill(null);
//     setNewSkill({ name: '', icon: '⚛️', level: 50, category: 'Frontend' });
//     setShowAddForm(false);
//   };

//   const handleDeleteSkill = (id) => {
//     setSkills(skills.filter(s => s.id !== id));
//   };

//   // Filter and sort
//   const filteredSkills = skills
//     .filter(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     .sort((a, b) => {
//       if (sortBy === 'level') return b.level - a.level;
//       if (sortBy === 'name') return a.name.localeCompare(b.name);
//       return 0;
//     });

//   const averageLevel = Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length);

//   const SkillCard = ({ skill, index }) => (
//     <motion.div
//       className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.05 }}
//       whileHover={{ y: -5, scale: 1.02 }}
//     >
//       {/* Gradient overlay on hover */}
//       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-600/0 group-hover:from-cyan-500/5 group-hover:to-purple-600/5 transition-all duration-300 rounded-2xl" />
      
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div className="text-4xl">{skill.icon}</div>
//             <div>
//               <h3 className="text-xl font-bold">{skill.name}</h3>
//               <span className={`text-sm px-2 py-1 rounded-full ${
//                 skill.level >= 80 ? 'bg-cyan-500/20 text-cyan-400' :
//                 skill.level >= 50 ? 'bg-purple-500/20 text-purple-400' :
//                 'bg-green-500/20 text-green-400'
//               }`}>
//                 {skill.experience}
//               </span>
//             </div>
//           </div>
          
//           {isManualMode && (
//             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button
//                 onClick={() => handleEditSkill(skill)}
//                 className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
//               >
//                 <Edit2 size={16} className="text-cyan-400" />
//               </button>
//               <button
//                 onClick={() => handleDeleteSkill(skill.id)}
//                 className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
//               >
//                 <Trash2 size={16} className="text-red-400" />
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-400">{skill.category}</span>
//             <span className="font-bold text-cyan-400">{skill.level}%</span>
//           </div>
//           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//             <motion.div
//               className={`h-full bg-gradient-to-r ${getProgressColor(skill.level)} rounded-full`}
//               initial={{ width: 0 }}
//               animate={{ width: `${skill.level}%` }}
//               transition={{ duration: 1, delay: index * 0.05 }}
//             />
//           </div>
//         </div>
//       </div>
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
//           className="mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
//                 <Award size={32} />
//               </div>
//               <div>
//                 <h1 className="text-4xl md:text-5xl font-bold">Your Skills</h1>
//                 <p className="text-slate-400 mt-1">
//                   {isManualMode ? 'Manage your skill set' : 'Inferred from your repositories'}
//                 </p>
//               </div>
//             </div>

//             {/* Mode Toggle */}
//             <button
//               onClick={() => setIsManualMode(!isManualMode)}
//               className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
//             >
//               {isManualMode ? '✏️ Manual Mode' : '🤖 Auto Mode'}
//             </button>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Total Skills</p>
//                   <p className="text-3xl font-bold text-cyan-400">{skills.length}</p>
//                 </div>
//                 <Code className="text-cyan-400" size={32} />
//               </div>
//             </div>
            
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Average Level</p>
//                   <p className="text-3xl font-bold text-purple-400">{averageLevel}%</p>
//                 </div>
//                 <BarChart3 className="text-purple-400" size={32} />
//               </div>
//             </div>
            
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-slate-400 text-sm mb-1">Advanced Skills</p>
//                   <p className="text-3xl font-bold text-pink-400">
//                     {skills.filter(s => s.level >= 80).length}
//                   </p>
//                 </div>
//                 <Target className="text-pink-400" size={32} />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Controls */}
//         <motion.div
//           className="flex flex-col md:flex-row gap-4 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//         >
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search skills..."
//               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
//             />
//           </div>

//           {/* Sort */}
//           <div className="relative">
//             <button
//               onClick={() => setShowSortMenu(!showSortMenu)}
//               className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
//             >
//               <Filter size={18} />
//               Sort by: {sortBy === 'level' ? 'Level' : 'Name'}
//               <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
//             </button>

//             <AnimatePresence>
//               {showSortMenu && (
//                 <motion.div
//                   className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                 >
//                   <button
//                     onClick={() => { setSortBy('level'); setShowSortMenu(false); }}
//                     className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left"
//                   >
//                     By Level
//                   </button>
//                   <button
//                     onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
//                     className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left"
//                   >
//                     By Name
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Add Button */}
//           {isManualMode && (
//             <motion.button
//               onClick={() => {
//                 setShowAddForm(true);
//                 setEditingSkill(null);
//                 setNewSkill({ name: '', icon: '⚛️', level: 50, category: 'Frontend' });
//               }}
//               className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Plus size={20} />
//               Add Skill
//             </motion.button>
//           )}
//         </motion.div>

//         {/* Add/Edit Form Modal */}
//         <AnimatePresence>
//           {showAddForm && (
//             <motion.div
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowAddForm(false)}
//             >
//               <motion.div
//                 className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold flex items-center gap-2">
//                     <Sparkles className="text-cyan-400" size={24} />
//                     {editingSkill ? 'Edit Skill' : 'Add New Skill'}
//                   </h2>
//                   <button
//                     onClick={() => setShowAddForm(false)}
//                     className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
//                     <input
//                       type="text"
//                       value={newSkill.name}
//                       onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
//                       placeholder="e.g., React"
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Icon (Emoji)</label>
//                     <input
//                       type="text"
//                       value={newSkill.icon}
//                       onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
//                       placeholder="⚛️"
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                       maxLength={2}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
//                     <select
//                       value={newSkill.category}
//                       onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     >
//                       <option value="Frontend">Frontend</option>
//                       <option value="Backend">Backend</option>
//                       <option value="Language">Language</option>
//                       <option value="Database">Database</option>
//                       <option value="DevOps">DevOps</option>
//                       <option value="Cloud">Cloud</option>
//                       <option value="Tools">Tools</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">
//                       Skill Level: {newSkill.level}% ({getSkillLevel(newSkill.level)})
//                     </label>
//                     <input
//                       type="range"
//                       min="0"
//                       max="100"
//                       value={newSkill.level}
//                       onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
//                       className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
//                       style={{
//                         background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${newSkill.level}%, rgba(255,255,255,0.1) ${newSkill.level}%, rgba(255,255,255,0.1) 100%)`
//                       }}
//                     />
//                     <div className="flex justify-between text-xs text-slate-500 mt-1">
//                       <span>Beginner</span>
//                       <span>Intermediate</span>
//                       <span>Advanced</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                   <button
//                     onClick={() => setShowAddForm(false)}
//                     className="flex-1 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
//                   >
//                     {editingSkill ? 'Update' : 'Add'} Skill
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Skills Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredSkills.map((skill, index) => (
//             <SkillCard key={skill.id} skill={skill} index={index} />
//           ))}
//         </div>

//         {filteredSkills.length === 0 && (
//           <motion.div
//             className="text-center py-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <p className="text-slate-400 text-lg">No skills found matching "{searchQuery}"</p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Skills;