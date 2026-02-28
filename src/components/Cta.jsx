import { motion } from 'framer-motion';
import MotionBtn from './MotionBtn';

const Cta = ()=>{
    return(
        <section className="relative z-10 px-6 py-20 md:py-32 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Build Your
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  Developer Profile?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of developers showcasing their work with SkillNest. 
                Start building your portfolio today, completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MotionBtn variant='large' className="px-14 font-bold text-lg">
                  <a href="#modes">
                    Get Started Free
                  </a>
                </MotionBtn>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
}

export default Cta;