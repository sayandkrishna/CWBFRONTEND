// src/pages/SignupPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Mock API Client ---
// To make this component self-contained and fix the resolution error,
// we'll create a mock apiClient. In a real application, you would
// import your configured axios instance as you were doing before.
const apiClient = {
    post: (url, data) => {
        return new Promise((resolve, reject) => {
            console.log('Mock API call to:', url, 'with data:', data);
            // Simulate a successful signup
            if (url.includes('signup')) {
                setTimeout(() => {
                    resolve({ data: { message: 'Signup successful!' } });
                }, 1000); // 1-second delay to simulate network
            } else {
                // Simulate an error for other endpoints
                setTimeout(() => {
                    reject({ response: { data: { message: 'Endpoint not found' } } });
                }, 1000);
            }
        });
    }
};


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

interface SignupPageProps {
    onNavigate: () => void;
    onSignupSuccess: () => void;
    onBack: () => void;
}

// --- SignupPage Component ---

const SignupPage = ({ onNavigate, onSignupSuccess, onBack }: SignupPageProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiClient.post('/signup', {
                username: username,
                password: password,
            });
            console.log('Signup successful:', response.data);
            onSignupSuccess();
        } catch (err: any) {
            console.error('Signup failed:', err);
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
                <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
                <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-0">
                 <Planet size={60} color="radial-gradient(circle, #34D399, #059669)" orbit={{ x: [250, -250], y: [-20, 20] }} initialPosition={{ top: '15%', left: '15%' }} duration={30} />
                 <Planet size={30} color="radial-gradient(circle, #38BDF8, #0EA5E9)" orbit={{ x: [-150, 150], y: [80, -80] }} initialPosition={{ bottom: '20%', right: '20%' }} duration={20} />
            </div>

            {/* Back Button */}
            <button 
                onClick={onBack} 
                className="absolute top-6 left-6 text-sm text-gray-400 hover:text-white transition-colors z-20 flex items-center space-x-2"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Back to Home</span>
            </button>
            
            {/* Signup Form Container */}
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
                        <h1 className="text-3xl font-bold text-white">Create an Account</h1>
                        <p className="text-gray-400">Start your journey with us today</p>
                    </motion.div>
                    
                    <form className="space-y-6" onSubmit={handleSignup}>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        
                        <motion.div variants={itemVariants}>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 placeholder-gray-500 transition"
                                placeholder="choose_a_username"
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
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="••••••••"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 placeholder-gray-500 transition"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-bold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </motion.div>
                    </form>

                    <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onNavigate}
                            className="font-medium text-cyan-400 hover:underline focus:outline-none"
                        >
                            Login here
                        </button>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
