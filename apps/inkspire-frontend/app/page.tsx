"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Circle, Diamond, Pencil, Ruler, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const InkCanvasAnimation = () => {
  const [activeStroke, setActiveStroke] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const strokes = [
    { path: "M 50 150 Q 100 50 150 150 T 250 150", color: "#6366f1" },
    { path: "M 100 100 L 200 200", color: "#ec4899" },
    { path: "M 150 50 L 150 250", color: "#f59e0b" },
    { path: "M 50 200 A 50 50 0 0 1 150 200", color: "#10b981" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStroke((prev) => (prev + 1) % strokes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate normalized mouse position for effects
  const normalizedMouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
  const normalizedMouseY = (mousePosition.y / window.innerHeight) * 2 - 1;

  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-900 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      
      {/* Mouse position indicator (hidden but used for effects) */}
      <div 
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
          transform: `translate(${normalizedMouseX * 20}px, ${normalizedMouseY * 20}px)`
        }}
      />
      
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <AnimatePresence>
          {strokes.map((stroke, i) => (
            <motion.path
              key={i}
              d={stroke.path}
              fill="none"
              stroke={stroke.color}
              strokeWidth="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: activeStroke === i ? 1 : 0,
                opacity: activeStroke === i ? 1 : 0
              }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
        </AnimatePresence>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Floating ink blots that react to mouse */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(40px)'
              }}
              animate={{
                x: [0, Math.random() * 200 - 100 + normalizedMouseX * 50],
                y: [0, Math.random() * 200 - 100 + normalizedMouseY * 50],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Interactive particles that follow mouse */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3,
                  x: normalizedMouseX * 20,
                  y: normalizedMouseY * 20
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50 + normalizedMouseX * 30],
                  y: [0, Math.random() * 100 - 50 + normalizedMouseY * 30],
                  rotate: 360
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Floating text with mouse-responsive chromatic aberration */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              textShadow: [
                `0 0 10px rgba(99, 102, 241, ${0.3 + Math.abs(normalizedMouseX * 0.2)})`,
                `0 0 15px rgba(236, 72, 153, ${0.3 + Math.abs(normalizedMouseY * 0.2)})`,
                `0 0 10px rgba(99, 102, 241, ${0.3 + Math.abs(normalizedMouseX * 0.2)})`
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="relative">
              <motion.h3 
                className="text-4xl md:text-5xl font-bold text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  transform: `translate(${normalizedMouseX * 10}px, ${normalizedMouseY * 10}px)`
                }}
              >
                <span className="relative">
                  <span 
                    className="absolute -left-1 -top-1 text-indigo-300/80"
                    style={{
                      transform: `translate(${normalizedMouseX * -3}px, ${normalizedMouseY * -3}px)`
                    }}
                  >
                    Live Canvas
                  </span>
                  <span 
                    className="absolute -right-1 -bottom-1 text-purple-300/80"
                    style={{
                      transform: `translate(${normalizedMouseX * 3}px, ${normalizedMouseY * 3}px)`
                    }}
                  >
                    Live Canvas
                  </span>
                  <span className="relative text-white">Live Canvas</span>
                </span>
              </motion.h3>
              
              <motion.p
                className="text-lg text-gray-300 mt-4 text-center max-w-md mx-auto relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                  transform: `translate(${normalizedMouseX * 5}px, ${normalizedMouseY * 5}px)`
                }}
              >
                <span 
                  className="absolute -left-0.5 -top-0.5 text-indigo-200/60"
                  style={{
                    transform: `translate(${normalizedMouseX * -2}px, ${normalizedMouseY * -2}px)`
                  }}
                >
                  Watch creations come to life
                </span>
                <span 
                  className="absolute -right-0.5 -bottom-0.5 text-purple-200/60"
                  style={{
                    transform: `translate(${normalizedMouseX * 2}px, ${normalizedMouseY * 2}px)`
                  }}
                >
                  Watch creations come to life
                </span>
                <span className="relative">Watch creations come to life</span>
              </motion.p>
            </div>
          </motion.div>

          {/* Animated sparkles that react to mouse */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-indigo-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                x: normalizedMouseX * 10,
                y: normalizedMouseY * 10
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 shadow-2xl hover:shadow-indigo-500/20 transition-all"
  >
    <div className="w-14 h-14 rounded-xl bg-indigo-900/50 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 py-6 px-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div 
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Pencil className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Inkspire
            </span>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signin" className="text-sm font-medium hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/app" 
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Launch App
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Collaborative
            </span> <br /> Digital Canvas
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create stunning artwork together in real-time with our intuitive drawing platform.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/app"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-xl hover:shadow-indigo-500/30"
              >
                Start Creating <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-6xl"
        >
          <InkCanvasAnimation />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to create, collaborate, and share your artwork
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Share2 className="h-6 w-6 text-indigo-400" />}
            title="Real-time Sync"
            description="See changes instantly as your team creates together"
            delay={0}
          />
          <FeatureCard
            icon={<Pencil className="h-6 w-6 text-purple-400" />}
            title="Advanced Tools"
            description="Precision drawing tools with customizable settings"
            delay={1}
          />
          <FeatureCard
            icon={<Ruler className="h-6 w-6 text-pink-400" />}
            title="Vector Precision"
            description="Crisp lines and shapes at any zoom level"
            delay={2}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 text-center border border-gray-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Together?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Join artists, designers, and creators worldwide in our collaborative space.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-medium shadow-xl hover:shadow-indigo-500/30 transition-all"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-gray-800 text-center"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Inkspire
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Inkspire. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};