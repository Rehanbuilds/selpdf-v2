'use client';

import { motion } from 'framer-motion';
import { FileText, FolderKanban, RotateCw, Edit3, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

const categoryNodes = [
  { id: 'organize', icon: FolderKanban, label: 'Organize', color: 'bg-blue-500/20 text-blue-600' },
  { id: 'convert', icon: RotateCw, label: 'Convert', color: 'bg-green-500/20 text-green-600' },
  { id: 'edit', icon: Edit3, label: 'Edit', color: 'bg-orange-500/20 text-orange-600' },
  { id: 'security', icon: Shield, label: 'Security', color: 'bg-purple-500/20 text-purple-600' },
];

const ORBIT_RADIUS_MOBILE = 140;
const ORBIT_RADIUS_DESKTOP = 180;
const ORBIT_DURATION = 12;

export function AnimatedHero() {
  const [orbitRadius, setOrbitRadius] = useState(ORBIT_RADIUS_MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setOrbitRadius(window.innerWidth >= 768 ? ORBIT_RADIUS_DESKTOP : ORBIT_RADIUS_MOBILE);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-12 md:py-20">
      <div className="flex items-center justify-center">
        <div className="relative h-96 w-96 md:h-[500px] md:w-[500px]">
          {/* Background Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[280px] w-[280px] rounded-full border border-muted-foreground/10 md:h-[360px] md:w-[360px]" />
          </div>

          {/* Center Icon */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
          >
            <motion.div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-background shadow-lg ring-4 ring-primary/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 ring-2 ring-primary/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <FileText className="h-10 w-10 text-primary" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Orbiting Icons */}
          {categoryNodes.map((node, index) => {
            const startAngle = (360 / categoryNodes.length) * index;
            const Icon = node.icon;

            return (
              <motion.div
                key={node.id}
                className="absolute left-1/2 top-1/2 z-[5]"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: ORBIT_DURATION,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: -(startAngle / 360) * ORBIT_DURATION,
                }}
                style={{
                  transformOrigin: 'center',
                }}
              >
                <motion.div
                  className="absolute"
                  style={{
                    x: orbitRadius,
                    y: 0,
                  }}
                >
                  <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{ 
                      rotate: -360,
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: ORBIT_DURATION,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: -(startAngle / 360) * ORBIT_DURATION,
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.15,
                      },
                    }}
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm ring-1 ring-white/20 ${node.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap">
                      <p className="text-xs font-medium text-muted-foreground">{node.label}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
