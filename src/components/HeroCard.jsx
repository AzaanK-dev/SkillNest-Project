import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const floatAnim = {
  animate: { y: [0, -12, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};

const VARIANTS = {
  github: {
    card: "from-slate-900/80 to-slate-800/70 border-cyan-500/20",
    glow: "from-cyan-500/10 via-purple-500/10 to-pink-500/10",
    icon: "from-cyan-400 to-purple-600",
    statBorder: "border-white/20"
  },
  manual: {
    card: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
    glow: "from-purple-500/20 via-pink-500/20 to-transparent",
    icon: "from-purple-400 to-pink-600",
    statBorder: "border-purple-400/20"
  }
};

const HeroCard = ({
  title,
  subtitle,
  className="",
  features = [],
  icon: Icon,
  stats,
  actions,
  variant = "github"
}) => {
  const theme = VARIANTS[variant];

  return (
    <motion.div
      initial={{ opacity: 0, x: -80, rotate: -2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`relative hidden lg:flex flex-col w-2/5 rounded-3xl p-12 bg-gradient-to-br ${theme.card} border backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.glow} pointer-events-none`}
      />

      {/* Floating Icon */}
      <motion.div
        {...floatAnim}
        className={`relative z-10 w-24 h-24 mb-8 rounded-2xl 
          bg-gradient-to-br ${theme.icon} flex items-center justify-center`}
      >
        <Icon size={44} />
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-slate-950"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles
            size={16}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <h2 className="text-5xl font-bold mb-4 relative z-10">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-slate-300 mb-8 relative z-10">
        {subtitle}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-4 text-sm text-slate-300 relative z-10">
        {features.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <item.icon className={item.color} size={18} />
            {item.text}
          </li>
        ))}
      </ul>

      {/* Stats */}
      {stats && (
        <div
          className={`grid grid-cols-3 gap-3 pt-6 mt-6 border-t ${theme.statBorder} relative z-10`}
        >
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      {/* Actions */}
      {actions && (
        <div className="w-full flex justify-around gap-3 mt-8 relative z-10">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default HeroCard;
