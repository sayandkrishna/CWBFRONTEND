import React from 'react';
import { motion } from 'framer-motion';

// --- SVG Icons ---

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

// --- Reusable Planet Component ---
const Planet = ({ size, color, orbit, initialPosition, duration }) => {
    return (
        <motion.div className="absolute" style={{ width: size, height: size, ...initialPosition, }} animate={{ rotate: 360, }} transition={{ loop: Infinity, ease: "linear", duration: duration * 2, }}>
            <motion.div className="w-full h-full rounded-full" style={{ background: color }} animate={{ x: orbit.x, y: orbit.y, }} transition={{ loop: Infinity, ease: "linear", duration: duration, repeatType: "mirror", }} />
        </motion.div>
    );
};

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

    return (
        <div className="bg-[#111111] font-sans text-gray-300 overflow-x-hidden">
            {/* Background Stars */}
            <div className="absolute inset-0 z-0 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-400"></div>
                <div className="absolute top-1/2 right-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="min-h-screen flex flex-col relative">
                {/* Header */}
                <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="w-full z-20">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3">
                                <ApiLogo />
                                <span className="font-semibold text-lg text-white">Smart Query API</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
                                <a href="#features" className="hover:text-white transition-colors">Features</a>
                                <a href="#technology" className="hover:text-white transition-colors">Technology</a>
                                <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
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
                        <Planet size={80} color="radial-gradient(circle, #38BDF8, #0EA5E9)" orbit={{ x: [-200, 200], y: [50, -50] }} initialPosition={{ top: '50%', left: '50%' }} duration={20} />
                        <Planet size={40} color="radial-gradient(circle, #A78BFA, #7C3AED)" orbit={{ x: [100, -100], y: [-150, 150] }} initialPosition={{ top: '40%', left: '60%' }} duration={15} />
                        <Planet size={20} color="radial-gradient(circle, #F472B6, #DB2777)" orbit={{ x: [-50, 50], y: [200, -200] }} initialPosition={{ top: '60%', left: '40%' }} duration={25} />
                        <Planet size={60} color="radial-gradient(circle, #34D399, #059669)" orbit={{ x: [250, -250], y: [-20, 20] }} initialPosition={{ top: '55%', left: '45%' }} duration={30} />
                    </div>

                    <motion.div className="relative z-10" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                            Query databases<br />with natural language.
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            A production-ready API that enables natural language interactions with your databases through intelligent intent detection, semantic caching, and LLM-powered SQL generation.
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

            {/* Features Section */}
            <motion.section 
                id="features" 
                className="py-20 sm:py-32 container mx-auto px-6 relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
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
                            className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center"
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
            </motion.section>
        </div>
    );
};

export default HeroPage;
