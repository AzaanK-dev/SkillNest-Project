import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const GithubProfileContext = createContext();

const initialState = {
  mode: 'github',
  profile: null,
  stats: null,
  skills: [],
  projects: [],
  activity: [],
  isLoading: false,
  error: null
}

const githubProfileReducer = (state, action) => {
  switch (action.type) {
    case 'BUILD_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'BUILD_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case 'BUILD_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_PROFILE':
      return initialState;
    default:
      return state;
  }
}

const getSkillLevel = (percent) => {
  if (percent > 40) return 'Advanced';
  if (percent > 20) return 'Intermediate';
  return 'Beginner';
}


export const GithubProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(githubProfileReducer, initialState)

  useEffect(() => {
    const cached = localStorage.getItem("githubProfile")
    if (cached) {
      const parsed = JSON.parse(cached)
      dispatch({
        type: 'BUILD_SUCCESS',
        payload: {
          profile: parsed.profile,
          skills: parsed.skills || [],
          projects: parsed.projects || [],
          stats: parsed.stats || {},
          activity: parsed.activity || [],
        },
      });
    }
  }, [])

  const buildProfile = async (username, token, socials = {}) => {
    dispatch({ type: 'BUILD_START' });
    try {
      const headers = token ? { Authorization: `token ${token}` } : {}
      const userRes = await axios.get(`https://api.github.com/users/${username}`, headers)
      const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, headers)
      const eventsRes = await axios.get(`https://api.github.com/users/${username}/events/public`, headers);

      const languageTotal = []
      await Promise.all(
        reposRes.data.filter(repo => !repo.fork).map(async repo => {
          if (!repo.languages_url) return;
          const langRes = await axios.get(repo.languages_url, headers)
          Object.entries(langRes.data).forEach(([lang, bytes]) => {
            languageTotal[lang] = (languageTotal[lang] || 0) + bytes
          })
        })
      )
      const bytesTotal = Object.values(languageTotal).reduce((a, b) => a + b, 0);

      const profile = {
        avatar: userRes.data.avatar_url,
        name: userRes.data.name || userRes.data.login,
        bio: userRes.data.bio,
        location: userRes.data.location,
        website: userRes.data.blog,
        socials
      }

      const skills = Object.entries(languageTotal).map(([lang, bytes]) => {
        const percent = Math.round((bytes / bytesTotal) * 100)
        return {
          name: lang,
          level: percent,
          experience: getSkillLevel(percent)
        }
      })

      const projects = reposRes.data
        .filter(repo => !repo.fork)
        .map(repo => ({
          id: repo.id,
          title: repo.name,
          description: repo.description,
          github: repo.html_url,
          live: repo.homepage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          tech: repo.language ? [repo.language] : [],
          updatedAt: repo.updated_at,
          status: 'Completed',
          featured: false
        }));

      const stats = {
        totalRepos: userRes.data.public_repos,
        followers: userRes.data.followers,
        following: userRes.data.following,
      };

      const activityData = eventsRes.data
        .filter(event => event.type === "PushEvent")
        .map(event => ({
          id: event.id,
          date: event.created_at.split("T")[0],
          repo: event.repo?.name,
          commits: event.payload.commits
            ? event.payload.commits.length
            : null, 
          message: event.payload.commits?.[0]?.message || null,
        }));

      dispatch({
        type: 'BUILD_SUCCESS',
        payload: {
          profile,
          skills,
          projects,
          stats,
          activity: activityData,
        },
      });
      // cache

      localStorage.setItem(
        'githubProfile',
        JSON.stringify({ profile, skills, projects, stats, activity: activityData })
      );

    } catch {
      dispatch({
        type: 'BUILD_ERROR',
        payload:
          error.response?.data?.message ||
          'Failed to build GitHub profile',
      });
    }
  }
  const clearProfile = () => {
    localStorage.removeItem('githubProfile');
    dispatch({ type: 'CLEAR_PROFILE' });
  };

  return (
    <GithubProfileContext.Provider
      value={{
        ...state,
        buildProfile,
        clearProfile,
      }}
    >
      {children}
    </GithubProfileContext.Provider>
  );
}