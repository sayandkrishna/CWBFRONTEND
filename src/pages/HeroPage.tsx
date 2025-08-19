import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// --- SVG Icons (Unchanged) ---

const ApiLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7V17M12 7V17M8 4L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const GetStartedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2">
        <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const NlpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const PerformanceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const DatabaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const SecurityIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- Reusable Planet Component (Updated) ---
const Planet = ({ size, color, orbit, initialPosition, duration, parallaxX, parallaxY }) => {
    return (
        <motion.div
            className="absolute"
            style={{
                width: size,
                height: size,
                ...initialPosition,
                x: parallaxX, // Apply parallax motion value for X-axis
                y: parallaxY, // Apply parallax motion value for Y-axis
            }}
            animate={{ rotate: 360, }}
            transition={{ loop: Infinity, ease: "linear", duration: duration * 2, }}
        >
            <motion.div
                className="w-full h-full rounded-full"
                style={{ background: color }}
                animate={{ x: orbit.x, y: orbit.y, }}
                transition={{ loop: Infinity, ease: "linear", duration: duration, repeatType: "mirror", }}
            />
        </motion.div>
    );
};

// --- Features Data (Unchanged) ---
const features = [
    {
        icon: <NlpIcon />,
        title: 'Natural Language Processing',
        description: 'Intent detection for common queries and LLM integration for complex requests.',
    },
    {
        icon: <PerformanceIcon />,
        title: 'Performance Optimization',
        description: 'Redis-based semantic caching reduces latency for similar queries.',
    },
    {
        icon: <DatabaseIcon />,
        title: 'Database Management',
        description: 'Connect to multiple PostgreSQL databases with automatic schema discovery.',
    },
    {
        icon: <SecurityIcon />,
        title: 'Security & Authentication',
        description: 'Secure JWT authentication and complete user data isolation.',
    },
];

interface HeroPageProps {
    onLogin: () => void;
    onSignup: () => void;
}

const HeroPage = ({ onLogin, onSignup }: HeroPageProps) => {
    // --- Animation Variants (Unchanged) ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };
    
    // --- Mouse Tracking and Parallax Logic ---
    const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const p1x = useTransform(mouseX, (val) => (val - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / -25);
    const p1y = useTransform(mouseY, (val) => (val - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / -25);
    const p2x = useTransform(mouseX, (val) => (val - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 40);
    const p2y = useTransform(mouseY, (val) => (val - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 40);
    const p3x = useTransform(mouseX, (val) => (val - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / -15);
    const p3y = useTransform(mouseY, (val) => (val - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / -15);
    const p4x = useTransform(mouseX, (val) => (val - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 30);
    const p4y = useTransform(mouseY, (val) => (val - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 30);


    return (
        <div className="bg-[#111111] font-sans text-gray-300 overflow-x-hidden">
            {/* Add smooth scrolling behavior to the page */}
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
            
            {/* Background Stars (Unchanged) */}
            <div className="absolute inset-0 z-0 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-400"></div>
                <div className="absolute top-1/2 right-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="min-h-screen flex flex-col relative">
                {/* Header (Unchanged) */}
                <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="w-full z-20">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3">
                                <ApiLogo />
                                <span className="font-semibold text-lg text-white">ConnectDB</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
                                <a href="#features" className="hover:text-white transition-colors">Features</a>
                                <a href="#technology" className="hover:text-white transition-colors">Technology</a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onLogin}
                                className="text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-md px-4 py-2 hover:bg-gray-700 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </nav>
                </motion.header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                        <Planet size={80} color="radial-gradient(circle, #38BDF8, #0EA5E9)" orbit={{ x: [-200, 200], y: [50, -50] }} initialPosition={{ top: '50%', left: '50%' }} duration={20} parallaxX={p1x} parallaxY={p1y} />
                        <Planet size={40} color="radial-gradient(circle, #A78BFA, #7C3AED)" orbit={{ x: [100, -100], y: [-150, 150] }} initialPosition={{ top: '40%', left: '60%' }} duration={15} parallaxX={p2x} parallaxY={p2y} />
                        <Planet size={20} color="radial-gradient(circle, #F472B6, #DB2777)" orbit={{ x: [-50, 50], y: [200, -200] }} initialPosition={{ top: '60%', left: '40%' }} duration={25} parallaxX={p3x} parallaxY={p3y} />
                        <Planet size={60} color="radial-gradient(circle, #34D399, #059669)" orbit={{ x: [250, -250], y: [-20, 20] }} initialPosition={{ top: '55%', left: '45%' }} duration={30} parallaxX={p4x} parallaxY={p4y} />
                    </div>

                    <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                            Stop writing SQL. <br />Start asking questions.
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            Our API lets you query databases using natural language with intelligent intent detection and LLM-boosted SQL generation.
                        </motion.p>
                        <motion.div variants={itemVariants} className="mt-10">
                            <button
                                onClick={onSignup}
                                className="text-base font-semibold text-white bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg shadow-cyan-500/10 flex items-center justify-center mx-auto"
                            >
                                <GetStartedIcon />
                                Get Started
                            </button>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
                        <a href="#features" aria-label="Scroll down">
                            <svg className="w-8 h-8 text-gray-500 animate-bounce hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </a>
                    </motion.div>
                </main>
            </div>

            {/* Overview Section */}
            <motion.section 
                id="overview" 
                className="py-20 sm:py-32 container mx-auto px-6 relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">A Production-Ready Database Query API</h2>
                    <p className="mt-4 text-lg text-gray-400">
                        This API transforms natural language queries into executable SQL statements, providing a bridge between human language and database operations. It's designed for developers, data analysts, and business users who need to query databases without writing SQL.
                    </p>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                id="features" 
                className="py-20 sm:py-32 bg-gray-900/20"
            >
                <div
                    className="container mx-auto px-6 relative z-10"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Core Features</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Built for performance, security, and ease of use.
                        </p>
                    </div>

                    <motion.div 
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index}
                                className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60"
                                variants={itemVariants}
                            >
                                <div className="text-cyan-400 w-12 h-12 mx-auto flex items-center justify-center bg-gray-800 rounded-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-5 font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
            
            {/* Technology Section */}
            <motion.section 
                id="technology" 
                className="py-20 sm:py-32 container mx-auto px-6 relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Technical Architecture</h2>
                    <p className="mt-4 text-lg text-gray-400">
                        A clean, maintainable, and modular design with a clear separation of concerns, leveraging FastAPI, Pydantic, and Redis for a robust and scalable solution.
                    </p>
                </div>
                <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">API Layer</h3>
                        <p className="mt-2 text-sm text-gray-400">FastAPI for routes and validation.</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">Authentication</h3>
                        <p className="mt-2 text-sm text-gray-400">JWT for secure user management.</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">Caching</h3>
                        <p className="mt-2 text-sm text-gray-400">Redis for semantic similarity.</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">Database</h3>
                        <p className="mt-2 text-sm text-gray-400">Connection pooling and schema discovery.</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">Data Models</h3>
                        <p className="mt-2 text-sm text-gray-400">Pydantic for validation schemas.</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:bg-gray-800/60">
                        <h3 className="font-semibold text-white">Business Logic</h3>
                        <p className="mt-2 text-sm text-gray-400">Orchestration and LLM integration.</p>
                    </div>
                </div>
            </motion.section>

        </div>
    );
};

export default HeroPage;
