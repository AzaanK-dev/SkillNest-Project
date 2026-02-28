import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { ManualProfileProvider } from './contextAPI/ManualProfileContext.jsx'
import { GithubProfileProvider } from './contextAPI/GithubProfileContext.jsx'
import ResumeProvider from './contextAPI/ResumeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ManualProfileProvider>
      <GithubProfileProvider>
        <ResumeProvider>
        <App />
        </ResumeProvider>
      </GithubProfileProvider>
      </ManualProfileProvider>
    </BrowserRouter>
  </StrictMode>,
)
