import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Github, Lock, Linkedin, Twitter, ChevronDown, ChevronUp,AlertCircle, CheckCircle, Info, Sparkles, Zap, Shield,TrendingUp, Users, Eye, EyeOff,Star,Folder,BookOpen,Calendar,Globe,Award,Code
} from 'lucide-react';
import HeroCard from '../components/HeroCard';
import { GithubProfileContext } from '../contextAPI/GithubProfileContext';
import { useNavigate,Link } from 'react-router-dom';

const GitHubProfile = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const {buildProfile,isLoading,error,profile} = useContext(GithubProfileContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const socials = {
      linkedin,
      twitter,
    };
    await buildProfile(username, token, socials);
  };

  useEffect(() => {
    if (profile) {
      setFeedback({
        type: "success",
        message: "Profile created successfully!",
      });
  
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    }
  }, [profile, navigate]);
  
  useEffect(() => {
    if (error) {
      setFeedback({
        type: "error",
        message: error,
      });
    }
  }, [error]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex flex-col lg:flex-row z-10 w-full gap-6 justify-around">
        <div className="lg:hidden flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
            <Github size={24} />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Build Your Profile
          </h1>
        </div>

        <HeroCard
          className="h-[45rem]"
          variant="github"
          title="Build Your Profile from GitHub"
          subtitle="Auto-generate skills, projects & activity"
          icon={Github}
          features={[
            { icon: Star, color: "text-yellow-400", text: "Skills inferred from repos" },
            { icon: Folder, color: "text-purple-400", text: "Projects auto-listed" },
            { icon: BookOpen, color: "text-cyan-400", text: "Daily activity logs" },
            { icon: Sparkles, color: "text-pink-400", text: "Customizable dashboards" },
            { icon: Calendar, color: "text-orange-400", text: "Learning milestones tracked" },
            { icon: Globe, color: "text-green-400", text: "Public profile showcase" },
            { icon: Award, color: "text-pink-300", text: "Achievements & badges" },
            { icon: Zap, color: "text-cyan-300", text: "Real-time notifications" },
            { icon: Code, color: "text-purple-300", text: "Code contributions highlighted" }
          ]}
        />

        {/* Main Card */}
        <div>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* GitHub Username*/}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                GitHub Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Github size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>


            {/* Smart Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-6 p-4 rounded-xl border ${feedback.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30'
                    : feedback.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {feedback.type === 'success' ? (
                      <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    ) : feedback.type === 'warning' ? (
                      <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    ) : (
                      <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    )}
                    <p className={`text-sm ${feedback.type === 'success'
                      ? 'text-green-200'
                      : feedback.type === 'warning'
                        ? 'text-yellow-200'
                        : 'text-red-200'
                      }`}>
                      {feedback.message}
                      {feedback.type === 'error' && (
                        <button className="block mt-2 text-xs underline hover:no-underline">
                          Add a token to continue instantly
                        </button>
                      )}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary CTA */}
            <motion.button
              type="submit"
              disabled={!username || isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              whileHover={{ scale: username && !isLoading ? 1.02 : 1 }}
              whileTap={{ scale: username && !isLoading ? 0.98 : 1 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Building Your Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Build My Profile</span>
                  <motion.div
                    className="group-hover:translate-x-1 transition-transform"
                    initial={{ x: 0 }}
                  >
                    →
                  </motion.div>
                </>
              )}
            </motion.button>

            {/* Info Footer */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="text-cyan-400" size={18} />
                  </div>
                  <p className="text-xs text-slate-400">Instant setup</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-400" size={18} />
                  </div>
                  <p className="text-xs text-slate-400">Public data only</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="text-green-400" size={18} />
                  </div>
                  <p className="text-xs text-slate-400">Secure & private</p>
                </div>
              </div>
            </div>
          </motion.form>

          {/* Bottom Help Text */}
          <div
            className="mt-6 text-center text-sm text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p>
              Want full control? Try{' '}
              <Link
                to="/createManualProfile"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Manual Profile Mode
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div >
  );
};

export default GitHubProfile;
