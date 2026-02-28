import { createContext, useEffect, useState } from "react";

export const ManualProfileContext = createContext();

export const ManualProfileProvider = ({ children }) => {
  const initialProfile = {
    info: {
      fullName: "",
      avatarUrl: "", 
      bio: "",
      linkedin: "",
      twitter: "",
      github: "",
      portfolio: ""
    },
    skills: [],
    projects: [],
    logs: []
  };

  const [data, setData] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  /* ==================== LOAD FROM STORAGE ==================== */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("manualProfile");
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      localStorage.removeItem("manualProfile");
      setData(initialProfile);
    }
  }, []);

  /* ==================== AUTO SAVE  ==================== */
  useEffect(() => {
    try {
      localStorage.setItem("manualProfile", JSON.stringify(data));
    } catch (error) {
      console.error("Auto Save Error:", error);
    }
  }, [data]);

  /* ==================== MANUAL SAVE ==================== */
  const saveProfile = () => {
    if (!data) return;
    setIsSaving(true);

    try {
      localStorage.setItem("manualProfile", JSON.stringify(data));
      setTimeout(() => setIsSaving(false), 800);
    } catch (error) {
      console.error("Save Profile Error:", error);
      setIsSaving(false);
    }
  };

  const resetProfile = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("manualProfile");
      setData(initialProfile);
    }
  };

  /* ==================== SKILL ACTIONS ==================== */
  const addSkill = (newSkill, getSkillLevel) => {
    if (!newSkill.name) return;

    const skill = {
      id: Date.now(),
      ...newSkill,
      experience: getSkillLevel(newSkill.level)
    };

    setData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const updateSkill = (id, updatedSkill, getSkillLevel) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id
          ? {
              ...skill,
              ...updatedSkill,
              experience: getSkillLevel(updatedSkill.level)
            }
          : skill
      )
    }));
  };

  const deleteSkill = id => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  /* ==================== PROJECT ACTIONS ==================== */
  const addProject = newProject => {
    if (!newProject.title || !newProject.description) return;

    const project = {
      id: Date.now(),
      stars: 0,
      forks: 0,
      featured: false,
      date: new Date().toISOString().split("T")[0],
      ...newProject
    };

    setData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  const updateProject = (id, updatedProject) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, ...updatedProject } : project
      )
    }));
  };

  const deleteProject = id => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  /* ==================== LOG ACTIONS ==================== */
  const addLog = newLog => {
    if (!newLog.title) return;

    const log = {
      id: Date.now(),
      ...newLog,
      timeSpent: Number(newLog.timeSpent)
    };

    setData(prev => ({
      ...prev,
      logs: [log, ...prev.logs]
    }));
  };

  const updateLog = (id, updatedLog) => {
    setData(prev => ({
      ...prev,
      logs: prev.logs.map(log =>
        log.id === id ? { ...log, ...updatedLog } : log
      )
    }));
  };

  const deleteLog = id => {
    setData(prev => ({
      ...prev,
      logs: prev.logs.filter(log => log.id !== id)
    }));
  };

  const getWeeklyActivity = logs => {
    const daysMap = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0
    };

    logs.forEach(log => {
      const day = new Date(log.date).toLocaleDateString("en-US", {
        weekday: "short"
      });
      daysMap[day] += Number(log.timeSpent || 0);
    });

    return Object.entries(daysMap).map(([day, hours]) => ({
      day,
      hours
    }));
  };

  /* ==================== CONTEXT PROVIDER ==================== */
  return (
    <ManualProfileContext.Provider
      value={{
        data,
        isSaving,
        saveProfile,
        resetProfile,
        setData,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addLog,
        updateLog,
        deleteLog,
        getWeeklyActivity
      }}
    >
      {children}
    </ManualProfileContext.Provider>
  );
};