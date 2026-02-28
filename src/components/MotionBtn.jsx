import { motion } from "framer-motion";

const baseStyles =
  "flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-300";

const variants = {
  gradient:
    "px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50",

  glass:
    "px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20",

  large:
    "group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300",

  purple:
    "px-6 py-3 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30",

  variant:
    "px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50",
};

const MotionBtn = ({
  children,
  variant = "gradient",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={`
        ${baseStyles}
        ${variants[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default MotionBtn;
