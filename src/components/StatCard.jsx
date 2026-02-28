import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {

    const useCounter = (end, duration = 2000) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }, [end, duration]);
        return count;
    };
    const animatedValue = useCounter(value);
    
    return (
        <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5, borderColor: color }}
        >
            <div className="flex items-center justify-between mb-3">
                <Icon className={`text-${color}-400`} size={24} />
                <motion.div
                    className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color === 'cyan' ? 'from-cyan-400 to-blue-500' : color === 'purple' ? 'from-purple-400 to-pink-500' : color === 'green' ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.3 }}
                >
                    {animatedValue.toLocaleString()}
                </motion.div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
        </motion.div>
    );
};

export default StatCard;