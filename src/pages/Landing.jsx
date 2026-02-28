import { motion } from 'framer-motion';
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from '../components/Features';
import Modes from '../components/Modes';
import Cta from '../components/Cta';
import Footer from '../components/Footer';

const Landing = () => {

  const particles=[]
  for(let i=0;i<30;i++){
    particles.push({
      id: i,
      x: Math.random()*100,
      y: Math.random()*100,
      size: Math.random()*4+2,
      duration: Math.random()*20+10
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <Hero/>

      {/* Modes Section */}
      <Modes/>

      {/* Features Section */}
      <Features/>

      {/* CTA Section */}
      <Cta/>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;

