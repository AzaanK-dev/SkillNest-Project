import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Sparkles, Folder, BookOpen, Link as LinkIcon,
  Image as ImageIcon,  Award, Eye,
  Target, Zap,
  Globe,
  Calendar
} from 'lucide-react';
import SkillForm from '../components/SkillForm';
import ProjectsForm from '../components/ProjectsForm';
import LogsForm from '../components/LogsForm';
import InfoForm from '../components/InfoForm';
import HeroCard from '../components/HeroCard';
import MotionBtn from '../components/MotionBtn';
import { ManualProfileContext } from '../contextAPI/ManualProfileContext';

const ManualProfile = () => {
  const {data,saveProfile,resetProfile,isSaving} = useContext(ManualProfileContext);
  const [showPreview, setShowPreview] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Two Column Layout */}
          <div className="relative flex flex-col lg:flex-row z-10 w-full gap-6 justify-around">
            <div className="lg:hidden flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                <User size={24} />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Build Your Profile
              </h1>
            </div>
            {/* Left: Hero Card */}
            <HeroCard
              className="h-[51rem]"
              variant="manual"
              title="Create Profile in Your own Way"
              subtitle="Craft your developer story by yourself."
              icon={User}
              features={[
                { icon: Sparkles, color: "text-purple-300", text: "Fully customizable skills" },
                { icon: BookOpen, color: "text-pink-300", text: "Track learning progress" },
                { icon: Zap, color: "text-cyan-300", text: "Complete creative control" },
                { icon: Folder, color: "text-purple-400", text: "Projects showcase easily" },
                { icon: Globe, color: "text-green-300", text: "Public profile showcase" },
                { icon: Calendar, color: "text-orange-300", text: "Daily learning milestones" },
                { icon: Award, color: "text-pink-400", text: "Skill ranking & recognition" },
              ]}
              stats={[
                { label: "Skills", value: data.skills.length },
                { label: "Projects", value: data.projects.length },
                { label: "Logs", value: data.logs.length }
              ]}
              actions={
                <>
                  <MotionBtn onClick={resetProfile} variant="purple">
                    Reset
                  </MotionBtn>
                </>
              }
            />
            {/* Right: Form Sections */}
            <motion.div
              className="space-y-6 lg:w-[650px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Section Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
                  { id: 'skills', label: 'Skills', icon: <Award size={16} /> },
                  { id: 'projects', label: 'Projects', icon: <Folder size={16} /> },
                  { id: 'logs', label: 'Learning Logs', icon: <BookOpen size={16} /> }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeSection === section.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* A. Personal Info Section */}
                {activeSection === 'personal' && (
                  <InfoForm/>
                )}

                {/* B. Skills Section */}
                {activeSection === 'skills' && (
                  <SkillForm/>
                )}

                {/* C. Projects Section */}
                {activeSection === 'projects' && (
                  <ProjectsForm/>
                )}

                {/* D. Learning Logs Section */}
                {activeSection === 'logs' && (
                  <LogsForm/>
                )}
              </AnimatePresence>

              {/* Save Button */}
              <div className="sticky bottom-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col items-center justify-center">
                <motion.button
                  type="button"
                  onClick={saveProfile}
                  disabled={!data || isSaving}
                  className="w-[90%] py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  whileHover={{ scale: !isSaving && data ? 1.02 : 1 }}
                  whileTap={{ scale: !isSaving && data ? 0.98 : 1 }}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Saving Your Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Save My Profile</span>
                      <motion.div
                        className="group-hover:translate-x-1 transition-transform"
                        initial={{ x: 0 }}
                      >
                        →
                      </motion.div>
                    </>
                  )}
                </motion.button>

                <p className="text-sm text-slate-500 text-center mt-2">
                  Auto-saves every 2 seconds
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualProfile;
