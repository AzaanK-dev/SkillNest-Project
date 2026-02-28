const Footer = () => {
  return (
    <footer className="relative z-10 px-6 py-12 md:px-12 border-t border-white/10 bg-transparent">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">

          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">SkillNest</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Full Stack Developer crafting modern, responsive, and high-performance web applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-center md:text-left">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-center md:text-left">
              <li>
                <a href="/projects" target="_blank" className="hover:text-cyan-400 transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/reviewATSResume" target="_blank" className="hover:text-cyan-400 transition-colors">
                  Resume
                </a>
              </li>
              <li>
                <a href="/skills" target="_blank" className="hover:text-cyan-400 transition-colors">
                  Skills
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-center md:text-left">Let’s Connect</h4>
            <div className="flex justify-center md:justify-start gap-6 text-slate-400">
              <a
                href="https://github.com/AzaanK-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/azaan-mehtab-khan-556a86369/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:azaanmehtabk@gmail.com"
                className="hover:text-cyan-400 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} SkillNest. Built with React & Tailwind.
        </div>

      </div>
    </footer>
  );
};

export default Footer;