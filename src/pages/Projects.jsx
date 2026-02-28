import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, Search, Plus, Edit2, Trash2, Github, Globe,
  Star, GitFork, Filter,
  ChevronDown, 
  Loader} from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';
import ProjectDetail from '../components/ProjectDetail';
import { GithubProfileContext } from '../contextAPI/GithubProfileContext';
import { useNavigate } from 'react-router-dom';
import MotionBtn from '../components/MotionBtn';

const Projects = () => {
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTech, setFilterTech] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();

  const { profile, projects:githubContProjects,isLoading } = useContext(GithubProfileContext)
  const [ githubProjects,setGithubProjects ] = useState([]) 
  useEffect(()=>{
    if(!isManualMode){
      setGithubProjects(githubContProjects)
    }
  },[isManualMode,githubContProjects])

  const {data,addProject,updateProject,deleteProject} = useContext(ManualProfileContext);
  const projects = isManualMode ? data.projects : githubProjects;

  // Form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech: [],
    github: '',
    live: '',
    image: '',
    status: 'Completed'
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

  // Get all unique tech tags
  const allTech = ['All', ...new Set(projects.flatMap(p => p.tech))];

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) return;
    addProject(newProject);
    resetForm();
  };

  const handleEditProject = (project) => {
    setEditingProject(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      tech: project.tech,
      github: project.github,
      live: project.live || '',
      image: project.image || '',
      status: project.status
    });
    setShowAddForm(true);
  };

  const handleUpdateProject = () => {
    updateProject(editingProject, newProject);
    resetForm();
  };

  const handleDeleteProject = (id) => {
    deleteProject(id);
  };

  const handleAddTech = (tech) => {
    if (tech && !newProject.tech.includes(tech)) {
      setNewProject({ ...newProject, tech: [...newProject.tech, tech] });
    }
  };

  const handleRemoveTech = (tech) => {
    setNewProject({ ...newProject, tech: newProject.tech.filter(t => t !== tech) });
  };

  const resetForm = () => {
    setEditingProject(null);
    setShowAddForm(false);
    setNewProject({
      title: '',
      description: '',
      tech: [],
      github: '',
      live: '',
      image: '',
      status: 'Completed'
    });
  };
  
  // Filter and search
  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(project => 
      filterTech === 'All' || project.tech.includes(filterTech)
    );

  const getTechColor = (tech) => {
    const colors = {
      'React': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Node.js': 'bg-green-500/20 text-green-400 border-green-500/30',
      'TypeScript': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Python': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Go': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Next.js': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      'Vue.js': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'MongoDB': 'bg-green-500/20 text-green-400 border-green-500/30',
      'PostgreSQL': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[tech] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Archived': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[status] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const ProjectCard = ({ project, index }) => (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden cursor-pointer h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => setSelectedProject(project)}
    >
      {/* Project Image */}
      {project.image && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          {project.featured && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm border border-yellow-400/50 rounded-full text-yellow-900 text-xs font-bold flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="text-cyan-400 flex-shrink-0" size={20} />
              <h3 className="text-xl font-bold line-clamp-1">{project.title}</h3>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          
          {isManualMode && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Edit2 size={14} className="text-cyan-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-300 text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Star size={14} />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={14} />
              {project.forks}
            </span>
          </div>
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group/link"
              >
                <Github size={16} className="text-slate-400 group-hover/link:text-white" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group/link"
              >
                <Globe size={16} className="text-slate-400 group-hover/link:text-cyan-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  if (!isManualMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <Loader className='animate-spin'/>
        <p>Please Wait!</p>
      </div>
    );
  }
  

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
                <Folder size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Your Projects</h1>
                <p className="text-slate-400 mt-1">
                  {isManualMode ? 'Manage your portfolio' : 'From your repositories'}
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              {isManualMode ? '🤖 Switch to Auto Mode' : '✏️ Switch to Manual Mode' }
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-cyan-400">{projects.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Total Stars</p>
              <p className="text-2xl font-bold text-yellow-400">
                {projects.reduce((acc, p) => acc + p.stars, 0)}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">Featured</p>
              <p className="text-2xl font-bold text-purple-400">
                {projects.filter(p => p.featured).length}
              </p>
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
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Filter size={18} />
              {filterTech === 'All' ? 'All Tech' : filterTech}
              <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {allTech.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => { setFilterTech(tech); setShowFilterMenu(false); }}
                      className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left whitespace-nowrap"
                    >
                      {tech}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Button */}
          {isManualMode && (
            <motion.button
              onClick={() => {
                setShowAddForm(true);
                setEditingProject(null);
                setNewProject({
                  title: '',
                  description: '',
                  tech: [],
                  github: '',
                  live: '',
                  image: '',
                  status: 'Completed'
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add Project
            </motion.button>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-400 text-lg">
              {searchQuery || filterTech !== 'All' 
                ? `No projects found matching your criteria`
                : 'No projects yet. Add your first project!'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ProjectModal
            editingProject={editingProject}
            newProject={newProject}
            setNewProject={setNewProject}
            setShowAddForm={setShowAddForm}
            handleAddProject={handleAddProject}
            handleUpdateProject={handleUpdateProject}
            handleAddTech={handleAddTech}
            handleRemoveTech={handleRemoveTech}
          />
        )}
      </AnimatePresence>


      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          getTechColor={getTechColor}
          getStatusColor={getStatusColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;



// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Folder, Search, Plus, X, Edit2, Trash2, Github, Globe,
//   ExternalLink, Star, GitFork, Calendar, Tag, Filter,
//   ChevronDown, Sparkles, Image as ImageIcon, Link as LinkIcon
// } from 'lucide-react';

// const Projects = () => {
//   const [isManualMode, setIsManualMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterTech, setFilterTech] = useState('All');
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showFilterMenu, setShowFilterMenu] = useState(false);

//   // Form state
//   const [newProject, setNewProject] = useState({
//     title: '',
//     description: '',
//     tech: [],
//     github: '',
//     live: '',
//     image: '',
//     status: 'Completed'
//   });

//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: 'TaskFlow Pro',
//       description: 'A modern project management tool with real-time collaboration, kanban boards, and AI-powered task suggestions.',
//       tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
//       github: 'https://github.com/username/taskflow',
//       live: 'https://taskflow-demo.com',
//       stars: 234,
//       forks: 45,
//       status: 'Active',
//       image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop',
//       featured: true,
//       date: '2024-01-15'
//     },
//     {
//       id: 2,
//       title: 'DevMetrics',
//       description: 'Analytics dashboard for developers to track coding habits, productivity patterns, and skill growth over time.',
//       tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
//       github: 'https://github.com/username/devmetrics',
//       live: 'https://devmetrics-demo.com',
//       stars: 189,
//       forks: 32,
//       status: 'Active',
//       image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
//       featured: true,
//       date: '2024-02-20'
//     },
//     {
//       id: 3,
//       title: 'API Gateway Suite',
//       description: 'Scalable microservices API gateway with authentication, rate limiting, and comprehensive monitoring.',
//       tech: ['Go', 'Redis', 'gRPC', 'Kubernetes'],
//       github: 'https://github.com/username/api-gateway',
//       live: null,
//       stars: 567,
//       forks: 89,
//       status: 'Completed',
//       image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
//       featured: true,
//       date: '2023-11-10'
//     },
//     {
//       id: 4,
//       title: 'ChatBot AI',
//       description: 'Intelligent chatbot powered by GPT-4 with context awareness and multi-language support.',
//       tech: ['Python', 'FastAPI', 'OpenAI', 'Docker'],
//       github: 'https://github.com/username/chatbot',
//       live: 'https://chatbot-demo.com',
//       stars: 412,
//       forks: 67,
//       status: 'Active',
//       image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop',
//       featured: false,
//       date: '2024-03-05'
//     },
//     {
//       id: 5,
//       title: 'E-Commerce Platform',
//       description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
//       tech: ['React', 'Express', 'Stripe', 'AWS'],
//       github: 'https://github.com/username/ecommerce',
//       live: 'https://shop-demo.com',
//       stars: 298,
//       forks: 54,
//       status: 'In Progress',
//       image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
//       featured: false,
//       date: '2024-04-12'
//     },
//     {
//       id: 6,
//       title: 'Weather Dashboard',
//       description: 'Beautiful weather app with real-time data, forecasts, and interactive maps.',
//       tech: ['Vue.js', 'Tailwind', 'OpenWeather API'],
//       github: 'https://github.com/username/weather',
//       live: 'https://weather-demo.com',
//       stars: 156,
//       forks: 28,
//       status: 'Completed',
//       image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop',
//       featured: false,
//       date: '2023-09-22'
//     }
//   ]);

//   // Get all unique tech tags
//   const allTech = ['All', ...new Set(projects.flatMap(p => p.tech))];

//   const handleAddProject = () => {
//     if (!newProject.title || !newProject.description) return;
//     const project = {
//       id: Date.now(),
//       ...newProject,
//       stars: 0,
//       forks: 0,
//       featured: false,
//       date: new Date().toISOString().split('T')[0]
//     };
//     setProjects([project, ...projects]);
//     setNewProject({
//       title: '',
//       description: '',
//       tech: [],
//       github: '',
//       live: '',
//       image: '',
//       status: 'Completed'
//     });
//     setShowAddForm(false);
//   };

//   const handleEditProject = (project) => {
//     setEditingProject(project.id);
//     setNewProject({
//       title: project.title,
//       description: project.description,
//       tech: project.tech,
//       github: project.github,
//       live: project.live || '',
//       image: project.image || '',
//       status: project.status
//     });
//     setShowAddForm(true);
//   };

//   const handleUpdateProject = () => {
//     setProjects(projects.map(p => 
//       p.id === editingProject 
//         ? { ...p, ...newProject }
//         : p
//     ));
//     setEditingProject(null);
//     setNewProject({
//       title: '',
//       description: '',
//       tech: [],
//       github: '',
//       live: '',
//       image: '',
//       status: 'Completed'
//     });
//     setShowAddForm(false);
//   };

//   const handleDeleteProject = (id) => {
//     setProjects(projects.filter(p => p.id !== id));
//   };

//   const handleAddTech = (tech) => {
//     if (tech && !newProject.tech.includes(tech)) {
//       setNewProject({ ...newProject, tech: [...newProject.tech, tech] });
//     }
//   };

//   const handleRemoveTech = (tech) => {
//     setNewProject({ ...newProject, tech: newProject.tech.filter(t => t !== tech) });
//   };

//   // Filter and search
//   const filteredProjects = projects
//     .filter(project => 
//       project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       project.description.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter(project => 
//       filterTech === 'All' || project.tech.includes(filterTech)
//     );

//   const getTechColor = (tech) => {
//     const colors = {
//       'React': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
//       'Node.js': 'bg-green-500/20 text-green-400 border-green-500/30',
//       'TypeScript': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//       'Python': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//       'Go': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
//       'Next.js': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
//       'Vue.js': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
//       'MongoDB': 'bg-green-500/20 text-green-400 border-green-500/30',
//       'PostgreSQL': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//     };
//     return colors[tech] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
//       'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//       'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//       'Archived': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
//     };
//     return colors[status] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
//   };

//   const ProjectCard = ({ project, index }) => (
//     <motion.div
//       className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden cursor-pointer h-full flex flex-col"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.05 }}
//       whileHover={{ y: -8, scale: 1.02 }}
//       onClick={() => setSelectedProject(project)}
//     >
//       {/* Project Image */}
//       {project.image && (
//         <div className="h-48 overflow-hidden relative">
//           <img 
//             src={project.image} 
//             alt={project.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
//           {project.featured && (
//             <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm border border-yellow-400/50 rounded-full text-yellow-900 text-xs font-bold flex items-center gap-1">
//               <Star size={12} fill="currentColor" />
//               Featured
//             </div>
//           )}
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-6 flex-1 flex flex-col">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-2">
//               <Folder className="text-cyan-400 flex-shrink-0" size={20} />
//               <h3 className="text-xl font-bold line-clamp-1">{project.title}</h3>
//             </div>
//             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
//               {project.status}
//             </span>
//           </div>
          
//           {isManualMode && (
//             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}
//                 className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
//               >
//                 <Edit2 size={14} className="text-cyan-400" />
//               </button>
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
//                 className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors"
//               >
//                 <Trash2 size={14} className="text-red-400" />
//               </button>
//             </div>
//           )}
//         </div>

//         <p className="text-slate-300 text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>

//         {/* Tech Stack */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {project.tech.slice(0, 3).map((tech, i) => (
//             <span
//               key={i}
//               className={`px-3 py-1 rounded-full text-xs font-medium border ${getTechColor(tech)}`}
//             >
//               {tech}
//             </span>
//           ))}
//           {project.tech.length > 3 && (
//             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
//               +{project.tech.length - 3}
//             </span>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-4 border-t border-white/10">
//           <div className="flex items-center gap-4 text-sm text-slate-400">
//             <span className="flex items-center gap-1">
//               <Star size={14} />
//               {project.stars}
//             </span>
//             <span className="flex items-center gap-1">
//               <GitFork size={14} />
//               {project.forks}
//             </span>
//           </div>
//           <div className="flex gap-2">
//             {project.github && (
//               <a
//                 href={project.github}
//                 onClick={(e) => e.stopPropagation()}
//                 className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group/link"
//               >
//                 <Github size={16} className="text-slate-400 group-hover/link:text-white" />
//               </a>
//             )}
//             {project.live && (
//               <a
//                 href={project.live}
//                 onClick={(e) => e.stopPropagation()}
//                 className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group/link"
//               >
//                 <Globe size={16} className="text-slate-400 group-hover/link:text-cyan-400" />
//               </a>
//             )}
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
//                 <Folder size={32} />
//               </div>
//               <div>
//                 <h1 className="text-4xl md:text-5xl font-bold">Your Projects</h1>
//                 <p className="text-slate-400 mt-1">
//                   {isManualMode ? 'Manage your portfolio' : 'From your repositories'}
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

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <p className="text-slate-400 text-sm mb-1">Total Projects</p>
//               <p className="text-2xl font-bold text-cyan-400">{projects.length}</p>
//             </div>
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <p className="text-slate-400 text-sm mb-1">Active</p>
//               <p className="text-2xl font-bold text-green-400">
//                 {projects.filter(p => p.status === 'Active').length}
//               </p>
//             </div>
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <p className="text-slate-400 text-sm mb-1">Total Stars</p>
//               <p className="text-2xl font-bold text-yellow-400">
//                 {projects.reduce((acc, p) => acc + p.stars, 0)}
//               </p>
//             </div>
//             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
//               <p className="text-slate-400 text-sm mb-1">Featured</p>
//               <p className="text-2xl font-bold text-purple-400">
//                 {projects.filter(p => p.featured).length}
//               </p>
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
//               placeholder="Search projects..."
//               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
//             />
//           </div>

//           {/* Filter */}
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterMenu(!showFilterMenu)}
//               className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
//             >
//               <Filter size={18} />
//               {filterTech === 'All' ? 'All Tech' : filterTech}
//               <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
//             </button>

//             <AnimatePresence>
//               {showFilterMenu && (
//                 <motion.div
//                   className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                 >
//                   {allTech.map((tech) => (
//                     <button
//                       key={tech}
//                       onClick={() => { setFilterTech(tech); setShowFilterMenu(false); }}
//                       className="w-full px-6 py-3 hover:bg-white/10 transition-colors text-left whitespace-nowrap"
//                     >
//                       {tech}
//                     </button>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Add Button */}
//           {isManualMode && (
//             <motion.button
//               onClick={() => {
//                 setShowAddForm(true);
//                 setEditingProject(null);
//                 setNewProject({
//                   title: '',
//                   description: '',
//                   tech: [],
//                   github: '',
//                   live: '',
//                   image: '',
//                   status: 'Completed'
//                 });
//               }}
//               className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Plus size={20} />
//               Add Project
//             </motion.button>
//           )}
//         </motion.div>

//         {/* Projects Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProjects.map((project, index) => (
//             <ProjectCard key={project.id} project={project} index={index} />
//           ))}
//         </div>

//         {filteredProjects.length === 0 && (
//           <motion.div
//             className="text-center py-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <p className="text-slate-400 text-lg">
//               {searchQuery || filterTech !== 'All' 
//                 ? `No projects found matching your criteria`
//                 : 'No projects yet. Add your first project!'}
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* Add/Edit Form Modal */}
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
//               className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl my-8"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold flex items-center gap-2">
//                   <Sparkles className="text-cyan-400" size={24} />
//                   {editingProject ? 'Edit Project' : 'Add New Project'}
//                 </h2>
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
//                   <input
//                     type="text"
//                     value={newProject.title}
//                     onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
//                     placeholder="e.g., TaskFlow Pro"
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
//                   <textarea
//                     value={newProject.description}
//                     onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//                     placeholder="Describe your project..."
//                     rows={4}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
//                   <div className="flex gap-2 mb-2">
//                     <input
//                       type="text"
//                       placeholder="Add technology..."
//                       className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           handleAddTech(e.target.value);
//                           e.target.value = '';
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {newProject.tech.map((tech, i) => (
//                       <span
//                         key={i}
//                         className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm flex items-center gap-2"
//                       >
//                         {tech}
//                         <button
//                           onClick={() => handleRemoveTech(tech)}
//                           className="hover:text-red-400 transition-colors"
//                         >
//                           <X size={14} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
//                     <input
//                       type="url"
//                       value={newProject.github}
//                       onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
//                       placeholder="https://github.com/..."
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo URL</label>
//                     <input
//                       type="url"
//                       value={newProject.live}
//                       onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
//                       placeholder="https://demo.com"
//                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Image URL (optional)</label>
//                   <input
//                     type="url"
//                     value={newProject.image}
//                     onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
//                     placeholder="https://..."
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
//                   <select
//                     value={newProject.status}
//                     onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Completed">Completed</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Archived">Archived</option>
//                   </select>
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
//                   onClick={editingProject ? handleUpdateProject : handleAddProject}
//                   disabled={!newProject.title || !newProject.description}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {editingProject ? 'Update' : 'Add'} Project
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Project Detail Modal */}
//       <AnimatePresence>
//         {selectedProject && (
//           <motion.div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedProject(null)}
//           >
//             <motion.div
//               className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden my-8"
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {selectedProject.image && (
//                 <div className="h-64 overflow-hidden relative">
//                   <img 
//                     src={selectedProject.image} 
//                     alt={selectedProject.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
//                   <button
//                     onClick={() => setSelectedProject(null)}
//                     className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 rounded-lg transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               )}
              
//               <div className="p-8">
//                 {!selectedProject.image && (
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
//                     <button
//                       onClick={() => setSelectedProject(null)}
//                       className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>
//                 )}

//                 {selectedProject.image && (
//                   <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
//                 )}

//                 <div className="flex flex-wrap gap-3 mb-6">
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedProject.status)}`}>
//                     {selectedProject.status}
//                   </span>
//                   {selectedProject.featured && (
//                     <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium flex items-center gap-1">
//                       <Star size={14} fill="currentColor" />
//                       Featured
//                     </span>
//                   )}
//                   <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-sm flex items-center gap-1">
//                     <Calendar size={14} />
//                     {new Date(selectedProject.date).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <p className="text-slate-300 text-lg mb-6 leading-relaxed">
//                   {selectedProject.description}
//                 </p>

//                 <div className="mb-6">
//                   <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
//                     <Tag size={16} />
//                     Tech Stack
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedProject.tech.map((tech, i) => (
//                       <span
//                         key={i}
//                         className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTechColor(tech)}`}
//                       >
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                     <div className="flex items-center gap-2 text-slate-400 mb-1">
//                       <Star size={16} />
//                       <span className="text-sm">Stars</span>
//                     </div>
//                     <p className="text-2xl font-bold">{selectedProject.stars}</p>
//                   </div>
//                   <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                     <div className="flex items-center gap-2 text-slate-400 mb-1">
//                       <GitFork size={16} />
//                       <span className="text-sm">Forks</span>
//                     </div>
//                     <p className="text-2xl font-bold">{selectedProject.forks}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   {selectedProject.github && (
//                     <a
//                       href={selectedProject.github}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
//                     >
//                       <Github size={20} />
//                       View Code
//                       <ExternalLink size={16} />
//                     </a>
//                   )}
//                   {selectedProject.live && (
//                     <a
//                       href={selectedProject.live}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold flex items-center justify-center gap-2"
//                     >
//                       <Globe size={20} />
//                       Live Demo
//                       <ExternalLink size={16} />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Projects;