// src/pages/SignupPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../axiosConfig'; // Corrected the path to the configured axios instance

// Define the props interface
interface SignupPageProps {
  onNavigate: () => void;
  onSignupSuccess: () => void;
  onBack: () => void;
}

const SignupPage = ({ onNavigate, onSignupSuccess, onBack }: SignupPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function is unchanged
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
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-400">Join CWB and interact with your data</p>
        </div>
        <form className="space-y-6" onSubmit={handleSignup}>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
              Your username
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
          <motion.div variants={itemVariants}>
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-300">
              Confirm password
            </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              className="bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-3 placeholder-gray-500"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating Account...' : 'Create an account'}
          </motion.button>
          
          <motion.p variants={itemVariants} className="text-sm text-center text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigate}
              className="font-medium text-amber-400 hover:underline focus:outline-none"
            >
              Login here
            </button>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;