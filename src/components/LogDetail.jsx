import { motion } from 'framer-motion';
import { Calendar, Clock, Edit2, Trash2, X } from 'lucide-react';

const LogDetail = ({
    isManualMode,
    selectedLog,
    setSelectedLog,
    getTechColor,
    handleEditLog,
    handleDeleteLog,
})=>{
    return(
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden my-8"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-white/10 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-3">{selectedLog.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} className="text-cyan-400" />
                        {new Date(selectedLog.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-400" />
                        {selectedLog.timeSpent} hours
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedLog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTechColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="p-8">
                <div className="prose prose-invert prose-cyan max-w-none">
                  {selectedLog.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-3xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-2xl font-bold mb-3 mt-5">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-xl font-bold mb-2 mt-4">{line.substring(4)}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={i} className="ml-6 mb-2 text-slate-300">{line.substring(2)}</li>;
                    } else if (line.startsWith('```')) {
                      return null; // Skip code fence markers
                    } else if (line.trim() === '') {
                      return <br key={i} />;
                    } else {
                      return <p key={i} className="mb-3 text-slate-300 leading-relaxed">{line}</p>;
                    }
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              {isManualMode && (
                <div className="bg-white/5 border-t border-white/10 p-6 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedLog(null);
                      handleEditLog(selectedLog);
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Log
                  </button>
                  <button
                    onClick={() => handleDeleteLog(selectedLog.id)}
                    className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-semibold flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
    )
}

export default LogDetail;