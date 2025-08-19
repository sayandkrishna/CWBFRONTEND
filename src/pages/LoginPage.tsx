import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../axiosConfig'; // Import the configured axios instance

// LoginPage Component
const LoginPage = ({ onNavigate, onLoginSuccess }: { onNavigate: () => void; onLoginSuccess: () => void; }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages from the API
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state during API call

  // Updated handleLogin function to be async and handle API calls
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send a POST request to your login endpoint
      const response = await apiClient.post('/login', {
        username: username,
        password: password,
      });

      console.log('Login successful:', response.data);
      onLoginSuccess(); // Navigate to the dashboard on success

    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for the form container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual form items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <>
      {/* This style tag defines the background animation */}
      <style>
        {`
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <section className="bg-gradient-to-br from-black via-indigo-950 to-black bg-[length:200%_200%] animate-[gradient-flow_15s_ease_infinite]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21.75c-4.83 0-8.75-3.92-8.75-8.75S7.17 4.25 12 4.25c4.83 0 8.75 3.92 8.75 8.75 0 1.83-.56 3.54-1.5 4.95M8 11h8m-8 3h4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.25V2.75M12 2.75c-4.83 0-8.75 1.12-8.75 2.5s3.92 2.5 8.75 2.5 8.75-1.12 8.75-2.5S16.83 2.75 12 2.75z"
              />
            </svg>
            DB Chat AI
          </a>
          <motion.div 
            className="w-full bg-black/60 backdrop-blur-sm rounded-lg shadow border border-gray-800 md:mt-0 sm:max-w-md xl:p-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <motion.h1 
                className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl"
                variants={itemVariants}
              >
                Sign in to your account
              </motion.h1>
              <motion.form 
                className="space-y-4 md:space-y-6" 
                onSubmit={handleLogin}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {error && (
                  <motion.p 
                    className="text-sm text-red-500 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                )}
                <motion.div variants={itemVariants}>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                    placeholder="your_username"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-700 rounded bg-gray-900 focus:ring-3 focus:ring-primary-600 ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign in'}
                </motion.button>
                <motion.p variants={itemVariants} className="text-sm font-light text-gray-400">
                  Don’t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={onNavigate}
                    className="font-medium text-primary-500 hover:underline bg-transparent border-none"
                  >
                    Sign up
                  </button>
                </motion.p>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
