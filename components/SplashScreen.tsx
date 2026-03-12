
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Spade } from './ui/Icons';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [status, setStatus] = useState("Connecting to TON...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress simulation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Non-linear progress for realism
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // Status text cycling
    const textTimer1 = setTimeout(() => setStatus("Securing Connection..."), 1500);
    const textTimer2 = setTimeout(() => setStatus("Entering Lobby..."), 3000);
    const finishTimer = setTimeout(() => onFinish(), 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-center z-[100] overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-0 animate-pulse"></div>

       {/* Logo Section */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.9, y: 10 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="flex flex-col items-center relative z-10"
       >
          <div className="relative mb-6">
             <Spade size={64} className="text-primary fill-primary drop-shadow-[0_0_15px_rgba(0,200,83,0.6)]" />
             <div className="absolute inset-0 bg-primary blur-[30px] opacity-40 animate-pulse"></div>
          </div>
          
          <h1 className="text-5xl font-black text-white tracking-tighter font-mono flex items-center gap-1">
            wpoker<span className="text-primary text-6xl leading-none">.</span>
          </h1>
          <p className="text-xs text-textSecondary uppercase tracking-[0.3em] opacity-60 mt-2">
            The Future of Poker
          </p>
       </motion.div>

       {/* Bottom Loading Area */}
       <div className="absolute bottom-16 w-full max-w-[240px] flex flex-col items-center gap-6 px-4">
          
          {/* Progress Bar Container */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#00C853]"
               initial={{ width: "0%" }}
               animate={{ width: `${progress}%` }}
               transition={{ ease: "linear" }}
             />
          </div>

          {/* Status Text */}
          <div className="h-6 flex items-center justify-center">
             <motion.p 
                key={status}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] text-textSecondary font-mono uppercase tracking-widest"
             >
                {status}
             </motion.p>
          </div>
       </div>
       
       <div className="absolute bottom-6 text-[9px] text-textSecondary/20 font-mono">
          v1.0.0 (Beta)
       </div>
    </div>
  );
};

export default SplashScreen;
