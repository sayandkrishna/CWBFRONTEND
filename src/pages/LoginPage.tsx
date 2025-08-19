// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../axiosConfig'; // This import path is assumed to be correct

// --- SVG & Reusable Components from HeroPage ---

const ApiLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7V17M12 7V17M8 4L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Planet = ({ size, color, orbit, initialPosition, duration }) => {
    return (
        <motion.div
            className="absolute"
            style={{ width: size, height: size, ...initialPosition, }}
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

// --- Props Interface ---

interface LoginPageProps {
    onNavigate: () => void;
    onLoginSuccess: () => void;
    onBack: () => void;
}

// --- LoginPage Component ---

const LoginPage = ({ onNavigate, onLoginSuccess, onBack }: LoginPageProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await apiClient.post('/login', {
                username: username,
                password: password,
            });
            console.log('Login successful:', response.data);
            if (response.data.access_token) {
                localStorage.setItem('accessToken', response.data.access_token);
            }
            onLoginSuccess();
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <div className="min-h-screen bg-[#111111] font-sans text-gray-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <Planet size={40} color="radial-gradient(circle, #A78BFA, #7C3AED)" orbit={{ x: [100, -100], y: [-150, 150] }} initialPosition={{ top: '20%', left: '80%' }} duration={15} />
                <Planet size={20} color="radial-gradient(circle, #F472B6, #DB2777)" orbit={{ x: [-50, 50], y: [200, -200] }} initialPosition={{ top: '70%', left: '10%' }} duration={25} />
            </div>

            {/* Back Button */}
            <button 
                onClick={onBack} 
                className="absolute top-6 left-6 text-sm text-gray-400 hover:text-white transition-colors z-20 flex items-center space-x-2"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Back to Home</span>
            </button>
            
            {/* Login Form Container */}
            <motion.div
                className="w-full max-w-md p-8 space-y-6 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                            <ApiLogo />
                            <span className="font-semibold text-2xl text-white">ConnectDB</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to continue your session</p>
                    </motion.div>
                    
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        
                        <motion.div variants={itemVariants}>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 placeholder-gray-500 transition"
                                placeholder="your_username"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 placeholder-gray-500 transition"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-bold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </motion.div>
                    </form>

                    <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onNavigate}
                            className="font-medium text-cyan-400 hover:underline focus:outline-none"
                        >
                            Sign up
                        </button>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;