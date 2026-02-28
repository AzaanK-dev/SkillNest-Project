import { Navigate, Route, Routes } from "react-router-dom"
import Landing from "../pages/Landing"
import Skills from "../pages/Skills"
import Projects from "../pages/Projects"
import Profile from "../pages/Profile"
import NotFound from "../pages/NotFound"
import GitHubProfile from "../pages/GithubProfile"
import ManualProfile from "../pages/ManualProfile"
import Logs from "../pages/Logs"
import ATSResume from "../pages/ATSResume"
import ResumeForm from "../components/ResumeForm"
import { ResumeContext } from "../contextAPI/ResumeContext"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="/skills" element={<Skills />}></Route>
            <Route path="/projects" element={<Projects />}></Route>
            <Route path="/logs" element={<Logs />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/createGithubProfile" element={<GitHubProfile />}></Route>
            <Route path="/createManualProfile" element={<ManualProfile />}></Route>
            <Route path="/resumeDetails" element={<ResumeForm />}></Route>
            <Route
                path="/reviewATSResume"
                element={
                    localStorage.getItem("canAccessATS") === "true"
                        ? <ATSResume />
                        : <Navigate to="/resumeDetails" replace />
                }
            />
            <Route path="*" element={<NotFound />}></Route>
        </Routes>
    )
}
export default Router