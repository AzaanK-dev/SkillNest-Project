import { Link } from "react-router-dom";

const NotFound = () => {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
  
        {/* Glowing 404 */}
        <div className="relative select-none">
          <h1
            className="text-[160px] font-black tracking-tighter leading-none text-slate-800"
            style={{ WebkitTextStroke: "2px #334155" }}
          >
            404
          </h1>
          <h1
            className="absolute inset-0 text-[160px] font-black tracking-tighter leading-none text-indigo-500 opacity-0"
            style={{
              animation: "pulse-glow 2.5s ease-in-out infinite",
              WebkitTextStroke: "1px #6366f1",
            }}
          >
            404
          </h1>
        </div>
  
        {/* Message */}
        <div
          className="text-center mt-2"
          style={{ animation: "fade-up 0.6s ease 0.2s both" }}
        >
          <p className="text-xl font-semibold text-slate-200 mb-2">Page not found</p>
          <p className="text-sm text-slate-500 max-w-xs">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
  
        {/* Divider line */}
        <div
          className="w-16 h-[2px] bg-indigo-600 rounded-full my-8"
          style={{ animation: "fade-up 0.6s ease 0.4s both" }}
        />
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/50"
          style={{ animation: "fade-up 0.6s ease 0.5s both" }}
        >
          ← Back to Home
        </Link>
  
        {/* Floating dots background */}
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-indigo-600 opacity-10"
            style={{
              width: `${[8, 12, 6, 10, 7, 9][i]}px`,
              height: `${[8, 12, 6, 10, 7, 9][i]}px`,
              top: `${[15, 70, 30, 80, 50, 20][i]}%`,
              left: `${[10, 85, 60, 20, 75, 40][i]}%`,
              animation: `float-dot ${[4, 5, 6, 4.5, 5.5, 3.5][i]}s ease-in-out ${[0, 1, 2, 0.5, 1.5, 2.5][i]}s infinite`,
            }}
          />
        ))}
  
        {/* Keyframes */}
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 0.15; transform: scale(1.02); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes float-dot {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-18px); }
          }
        `}</style>
      </div>
    );
  };
  
  export default NotFound;