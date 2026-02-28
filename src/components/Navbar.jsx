import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from '../assets/favicon.png'
import { Menu, X } from 'lucide-react';
import MotionBtn from './MotionBtn';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
    return (
        <motion.nav
            className="relative z-50 px-6 py-6 md:px-12"
            style={{ opacity: headerOpacity }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative">
                    <img src={Logo} alt="" className='w-10 h-10 rounded-lg'/>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                            SkillNest
                        </span>
                    </span>
                </motion.div>

                {/* Desktop Menu */}
                <motion.div
                    className="hidden md:flex items-center space-x-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Features</a>
                    <a href="#modes" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Modes</a>
                    <a href="#tech" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">Tech Stack</a>
                    <MotionBtn variant='gradient'>
                        <a href="#modes">
                            Get Started
                        </a>
                    </MotionBtn>
                </motion.div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 mt-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="px-6 py-6 space-y-4">
                        <a href="#features" className="block text-slate-300 hover:text-cyan-400 transition-colors">Features</a>
                        <a href="#modes" className="block text-slate-300 hover:text-cyan-400 transition-colors">Modes</a>
                        <a href="#tech" className="block text-slate-300 hover:text-cyan-400 transition-colors">Tech Stack</a>
                        <button className="w-full px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold">
                            <a href="#modes">
                                Get Started
                            </a>
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}

export default Navbar