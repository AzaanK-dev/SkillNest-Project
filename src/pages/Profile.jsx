import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Download,
  Code, Folder, BookOpen, GitCommit, TrendingUp, Award,
  ExternalLink, Calendar, Zap, Target, Heart, Star,
  MessageCircle, Globe, ArrowRight, CheckCircle, Flame,
  Loader,
  Trash
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import MotionBtn from '../components/MotionBtn';
import { GithubProfileContext } from '../contextAPI/GithubProfileContext';
import { Link, useNavigate } from 'react-router-dom';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const Profile = () => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [readMore, setReadMore] = useState(false);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.9]);
  const navigate = useNavigate()

  const { data: manualData } = useContext(ManualProfileContext);
  const { mode, profile, stats, skills, projects, activity, isLoading, clearProfile } = useContext(GithubProfileContext);

  const currentData = isAutoMode
    ? { profile, stats, skills, projects, activity } // GitHub
    : {
      profile: {
        avatar: manualData.info.avatarUrl,
        name: manualData.info.fullName,
        username: manualData.info.github || "", // optional
        bio: manualData.info.bio,
        location: "", // manual profile may not have location
        website: manualData.info.portfolio || "",
        socials: {
          linkedin: manualData.info.linkedin,
          twitter: manualData.info.twitter,
          github: manualData.info.github,
        },
      },
      stats: {
        skills: manualData.skills.length,
        projects: manualData.projects.length,
        logs: manualData.logs.length,
        commits: manualData.logs.reduce((sum, l) => sum + (l.timeSpent || 0), 0),
        streak: 0,
        consistency: 0,
      },
      skills: manualData.skills,
      projects: manualData.projects,
      activity: manualData.logs,
    };

  const profileData = useMemo(() => {
    if (!currentData || !currentData.profile) return null;

    const prof = currentData.profile;
    const statsData = currentData.stats;
    const skillsData = currentData.skills;
    const projectsData = currentData.projects;
    const activityData = currentData.activity;

    return {
      avatar: prof.avatar,
      name: prof.name,
      username: prof.username || "",
      bio: prof.bio || "",
      tagline: isAutoMode
        ? "Building the future, one commit at a time"
        : "Crafting my developer journey",
      location: prof.location || "",
      currentFocus: statsData?.currentFocus || "Learning & Building",
      goals: statsData?.goals || "Consistent daily progress",

      stats: {
        skills: skillsData.length,
        projects: projectsData.length,
        logs: statsData?.logs || 0,
        commits:
          activityData?.reduce(
            (sum, d) => sum + (d.commits || d.timeSpent || 0),
            0
          ) || 0,
      },

      topSkills: skillsData
        .sort((a, b) => (b.level || b.progress || 0) - (a.level || a.progress || 0))
        .slice(0, 6)
        .map((skill) => ({
          name: skill.name,
          level: skill.level || skill.progress || 0,
          icon: "⚡",
        })),

      featuredProjects: projectsData
        .sort((a, b) => (b.stars || 0) - (a.stars || 0))
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          description: p.description,
          tech: p.tech || [p.language].filter(Boolean),
          github: p.github || p.githubLink,
          live: p.live || p.liveLink,
          stars: p.stars || 0,
          featured: true,
        })),

      activityData: activityData || [],
      streakDays: statsData?.streak || 0,
      mostUsedTech: skillsData[0]?.name || "—",
      lastActive: "Recently",
      consistency: statsData?.consistency || 0,
    };
  }, [isAutoMode, currentData]);

  if (!profile || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <Loader className='animate-spin' />
        <p>Please Wait!</p>
      </div>
    );
  }

  const emptyProfile = !profileData ||
    (isAutoMode && !profileData.name) ||
    (!isAutoMode && !profileData.username);
  const ctaPath = isAutoMode ? "/createGithubProfile" : "/createManualProfile";
  const ctaText = isAutoMode ? "Connect GitHub Profile" : "Create Manual Profile";
  if (emptyProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="p-8 rounded-2xl border border-white/10 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3">
            {isAutoMode ? "GitHub Profile Not Connected" : "Manual Profile Not Created"}
          </h2>
          <p className="text-slate-400 mb-6">
            {isAutoMode ? "Please connect your GitHub account to continue." : "Please create your manual profile to continue."}
          </p>
          <MotionBtn
            variant="gradient"
            onClick={() => navigate(ctaPath)}
          >
            {ctaText}
          </MotionBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header - Hero Section */}
        <motion.div
          className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 mb-8"
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-4 border-slate-950 flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold">{profileData.name}</h1>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium">
                  {isAutoMode ? '🤖 Auto · GitHub' : '✏️ Manual · Local'}
                </span>
              </div>
              <p className="text-xl text-slate-400 mb-2">{profileData.username}</p>
              <p className="text-lg text-slate-300 mb-4 italic">"{profileData.tagline}"</p>
              <div className="flex items-center gap-2 text-slate-400 mb-6">
                <MapPin size={16} />
                <span>{profileData.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <MotionBtn variant="gradient" onClick={() => navigate("/resumeDetails")}>
                  <Download size={20} />
                  Download as ATS Resume
                </MotionBtn>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Identity Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard icon={Code} label="Skills Mastered" value={profileData.stats.skills} color="cyan" delay={0} />
          <StatCard icon={Folder} label="Projects Built" value={profileData.stats.projects} color="purple" delay={0.1} />
          <StatCard icon={BookOpen} label="Learning Logs" value={profileData.stats.logs} color="green" delay={0.2} />
          <StatCard icon={GitCommit} label={isAutoMode ? "Total Commits" : "Total Hours"} value={profileData.stats.commits} color="orange" delay={0.3} />
        </div>

        {/* About Section */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-3xl font-bold">About Me</h2>
          </div>

          <div className="space-y-4">
            <p className={`text-slate-300 leading-relaxed text-lg ${!readMore && 'line-clamp-3'}`}>
              {profileData.bio}
            </p>
            {profileData.bio.length > 200 && (
              <button
                onClick={() => setReadMore(!readMore)}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors"
              >
                {readMore ? 'Show less' : 'Read more'}
                <ArrowRight size={16} className={`transition-transform ${readMore ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-yellow-400" size={20} />
                <h3 className="font-bold text-lg">Current Focus</h3>
              </div>
              <p className="text-slate-300">{profileData.currentFocus}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-pink-400" size={20} />
                <h3 className="font-bold text-lg">2026 Goals</h3>
              </div>
              <p className="text-slate-300">{profileData.goals}</p>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Top Skills</h2>
                {isAutoMode && (
                  <p className="text-sm text-slate-400">Inferred from repositories</p>
                )}
              </div>
            </div>
            <Link to="/skills" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors">
              View all skills
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {profileData.topSkills.map((skill, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="font-semibold text-lg">{skill.name}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{skill.level}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <Star size={24} />
              </div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <Link to="/projects" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors">
              View all projects
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {profileData.featuredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Activity  */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-3xl font-bold">Activity & Growth</h2>
          </div>

          {/* Growth Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Learning Streak</span>
                <Flame className="text-orange-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">{profileData.streakDays} days</div>
              <div className="text-sm text-slate-500">Keep it up! 🔥</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Most Used Tech</span>
                <Code className="text-cyan-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">{profileData.mostUsedTech}</div>
              <div className="text-sm text-slate-500">This month</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Consistency</span>
                <Heart className="text-pink-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-pink-400 mb-1">{profileData.consistency}%</div>
              <div className="text-sm text-slate-500">Last 30 days</div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Activity Timeline</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar size={16} />
                <span>Last 6 months</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profileData.activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
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
                <Bar dataKey="commits" fill="url(#colorCommits)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="logs" fill="url(#colorLogs)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                <span className="text-sm text-slate-400">Commits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" />
                <span className="text-sm text-slate-400">Learning Logs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links & Contact Footer */}
        <motion.div
          className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Download Your Resume</h2>
            <p className="text-slate-300 text-lg">
              Get your ATS-optimized CV in a clean, recruiter-ready format.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <MotionBtn variant="variant" className='' onClick={() => navigate("/resumeDetails")}>
              <Download size={20} />
              Download as ATS Resume
            </MotionBtn>
          </div>
        </motion.div>

        {/* Cta + Footer */}
        <motion.div
          className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20 mt-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4">
            <MotionBtn 
            variant='glass'
            onClick={(() => {
              clearProfile();
              navigate("/")
            })}
            >
              <Trash size={24} color="#AA0808" />
              Clear Profile
            </MotionBtn>
            <MotionBtn
              onClick={() => {
                setIsAutoMode(!isAutoMode)
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              variant='purple'
            >
              {isAutoMode ? '✏️ Switch to Manual Mode' : '🤖 Switch to Auto Mode'}
            </MotionBtn>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-slate-400">
              Built using <span className="text-cyan-400 font-semibold">SkillNest</span>
            </p>
          </div>
          <div className="text-center mt-4">
            <p className="text-slate-300 text-lg">Always open to interesting conversations and collaborations</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
