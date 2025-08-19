// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../axiosConfig'; // Import the configured axios instance

// Define the props interface
interface LoginPageProps {
    onNavigate: () => void;
    onLoginSuccess: () => void;
    onBack: () => void;
}

const LoginPage = ({ onNavigate, onLoginSuccess, onBack }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function is unchanged
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
      onLoginSuccess();
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
            ← Back to Home
        </button>
        <motion.div
            className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to continue to CWB</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                
                <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 placeholder-gray-500"
                        placeholder="your_username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 placeholder-gray-500"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </motion.div>
                
                <motion.button
                    type="submit"
                    className="w-full text-black bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-800 font-bold rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </motion.button>
                
                <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onNavigate}
                        className="font-medium text-amber-400 hover:underline focus:outline-none"
                    >
                        Sign up
                    </button>
                </motion.p>
            </form>
        </motion.div>
    </div>
  );
};

export default LoginPage;