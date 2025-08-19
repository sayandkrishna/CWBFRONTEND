import React, { useState, useEffect, useRef, FormEvent, ChangeEvent, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

//==============================================================================
// 1. TYPE DEFINITIONS
//==============================================================================

/**
 * Defines the structure for a single database configuration object.
 */
export interface Database {
  id: string; // Assuming an ID is present for mapping keys
  db_name: string;
  config: {
    host: string;
    user: string;
  };
}

/**
 * Defines the structure of the complex response object from the LLM.
 */
export interface LlmResponseData {
  rows_returned: number;
  inferred_table: string;
  inferred_db_name: string;
  source: 'cache' | 'llm' | 'intent_detection' | 'semantic_cache' | 'llm_fallback';
  sql_query: string;
  data: Record<string, any>[];
}

/**
 * Defines the structure for a single message in the chat history.
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string | LlmResponseData;
}

/**
 * Defines the props for sub-components to ensure type safety.
 */
export interface ChatMessageProps {
  message: ChatMessage;
}

export interface DbConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: DbConfigSubmit) => void;
}

export interface InteractiveTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>[];
}

/**
 * Defines the structure for the form submission in the DbConnectionModal.
 */
export interface DbConfigSubmit {
  db_name: string;
  db_host: string;
  db_database: string;
  db_user: string;
  db_password: string;
  db_port: number;
}


//==============================================================================
// 2. API HELPER FUNCTIONS
//==============================================================================

const API_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches the list of database configurations for the logged-in user.
 */
export const getUserDatabases = async (token: string): Promise<Database[]> => {
  try {
    const response = await apiClient.get<{ databases: Database[] }>('/list-dbs', {
      headers: { 'token': token }
    });
    return response.data.databases;
  } catch (error) {
    console.error("Error fetching databases:", error);
    return [];
  }
};

/**
 * Saves a new database configuration for the user.
 */
export const saveDbConfig = async (token: string, config: DbConfigSubmit): Promise<boolean> => {
  try {
    await apiClient.post('/save-db-config', config, {
      headers: { 'token': token }
    });
    return true;
  } catch (error) {
    console.error("Error saving DB config:", error);
    alert(`Failed to save configuration: ${error.response?.data?.detail || 'An unknown error occurred.'}`);
    return false;
  }
};

/**
 * Sends a user's natural language query to the backend for processing.
 */
export const askLlm = async (token: string, prompt: string, history: ChatMessage[]): Promise<LlmResponseData> => {
  const payload = {
    user_query: prompt,
    conversation_history: history || []
  };
  try {
    const response = await apiClient.post<LlmResponseData>('/ask', payload, {
      headers: { 'token': token }
    });
    return response.data;
  } catch (error) {
    console.error("Error asking LLM:", error);
    return {
      rows_returned: 0,
      inferred_table: 'Error',
      inferred_db_name: 'System',
      source: 'llm',
      sql_query: 'N/A',
      data: [{ error: error.response?.data?.detail || 'Failed to connect to the AI service.' }]
    };
  }
};


//==============================================================================
// 3. SVG ICONS & STATIC COMPONENTS
//==============================================================================

const ApiLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M4 7V17M12 7V17M8 4L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const Planet: FC<{ size: number; color: string; orbit: { x: number[]; y: number[] }; initialPosition: React.CSSProperties; duration: number }> = ({ size, color, orbit, initialPosition, duration }) => (
    <motion.div className="absolute" style={{ width: size, height: size, ...initialPosition }} animate={{ rotate: 360 }} transition={{ loop: Infinity, ease: "linear", duration: duration * 2 }}><motion.div className="w-full h-full rounded-full" style={{ background: color }} animate={{ x: orbit.x, y: orbit.y }} transition={{ loop: Infinity, ease: "linear", duration: duration, repeatType: "mirror" }} /></motion.div>
);
const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CodeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DatabaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const AddIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ExpandIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;


//==============================================================================
// 4. MAIN DASHBOARD COMPONENT
//==============================================================================
interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: FC<DashboardPageProps> = ({ onLogout }) => {
    const [databases, setDatabases] = useState<Database[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome! I'm ready to help you query your databases. What would you like to know?" }
    ]);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [blastData, setBlastData] = useState<{ key: number; position: { x: number; y: number } } | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const authToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) {
                console.error("No auth token found.");
                return;
            }
            const dbs = await getUserDatabases(authToken);
            setDatabases(dbs);
        };
        fetchData();
    }, [authToken]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewDbSubmit = async (config: DbConfigSubmit) => {
        if (!authToken) return;
        const success = await saveDbConfig(authToken, config);
        if (success) {
            const dbs = await getUserDatabases(authToken);
            setDatabases(dbs);
        }
    };

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading || !authToken) return;

        if (submitButtonRef.current) {
            const buttonRect = submitButtonRef.current.getBoundingClientRect();
            setBlastData({
                key: Date.now(),
                position: { x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 }
            });
        }

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
        setMessages(newMessages);
        setPrompt('');
        setIsLoading(true);

        const history = newMessages.slice(-5, -1);
        const response = await askLlm(authToken, prompt, history);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        onLogout();
    };

    const sidebarVariants = {
        open: { width: '20rem' },
        closed: { width: '5rem' },
    };

    return (
        <div className="min-h-screen bg-[#111111] font-sans text-gray-300 flex relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
                <Planet size={60} color="radial-gradient(circle, #34D399, #059669)" orbit={{ x: [250, -250], y: [-20, 20] }} initialPosition={{ top: '15%', left: '85%' }} duration={40} />
                <Planet size={30} color="radial-gradient(circle, #38BDF8, #0EA5E9)" orbit={{ x: [-150, 150], y: [80, -80] }} initialPosition={{ bottom: '20%', right: '5%' }} duration={30} />
            </div>

            <div className="relative flex w-full h-screen">
                <motion.aside
                    variants={sidebarVariants}
                    initial={false}
                    animate={isSidebarOpen ? 'open' : 'closed'}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-black/30 backdrop-blur-lg border-r border-gray-800 flex-shrink-0 flex flex-col z-30 h-full"
                >
                    <div className="p-4 border-b border-gray-800 flex items-center space-x-3 overflow-hidden">
                        <ApiLogo />
                        <AnimatePresence>
                            {isSidebarOpen && <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="font-semibold text-lg text-white whitespace-nowrap">ConnectDB</motion.span>}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto overflow-x-hidden">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-3">
                            <DatabaseIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="whitespace-nowrap">Databases</motion.span>}
                            </AnimatePresence>
                        </h2>
                        <div className="space-y-2">
                            {databases.map((db, i) => (
                                <motion.div 
                                    key={db.id || db.db_name} 
                                    className={`bg-gray-900/50 border border-gray-800 p-3 rounded-lg flex items-center space-x-3 cursor-pointer ${!isSidebarOpen && 'justify-center'}`}
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-cyan-400"></div>
                                    <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="overflow-hidden">
                                            <h3 className="font-semibold text-white whitespace-nowrap">{db.db_name}</h3>
                                            <p className="text-xs text-gray-400 whitespace-nowrap">User: {db.config.user}</p>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-800 space-y-4">
                        <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center space-x-3 text-sm font-semibold text-white bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
                            <AddIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">Connect Database</motion.span>}
                            </AnimatePresence>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 text-sm text-gray-400 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
                            <LogoutIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">Logout</motion.span>}
                            </AnimatePresence>
                        </button>
                    </div>
                </motion.aside>

                <main className="flex-1 flex flex-col h-screen max-h-screen">
                    <header className="bg-black/30 backdrop-blur-lg border-b border-gray-800 p-4 flex items-center z-10 flex-shrink-0">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-gray-400 hover:text-white">
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-bold text-white">Chat with your Data</h1>
                    </header>
                    
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                        <ChatMessage message={msg} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800/80 rounded-lg p-3 max-w-2xl">
                                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    <div className="p-4 bg-black/30 backdrop-blur-lg border-t border-gray-800 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-4">
                            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask a question about your data..."
                                className="flex-grow bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 placeholder-gray-500 transition"/>
                            <button ref={submitButtonRef} type="submit" disabled={isLoading} className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                </main>
            </div>
            <DbConnectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleNewDbSubmit} />
            <AnimatePresence>
                {blastData && <BlastAnimation key={blastData.key} position={blastData.position} onComplete={() => setBlastData(null)} />}
            </AnimatePresence>
        </div>
    );
};


//==============================================================================
// 5. SUB-COMPONENTS
//==============================================================================

const BlastAnimation: FC<{ position: { x: number; y: number }; onComplete: () => void }> = ({ position, onComplete }) => {
    return (
        <motion.div className="fixed top-0 left-0 z-50 pointer-events-none" style={{ x: position.x, y: position.y }} onAnimationComplete={onComplete}>
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={i} className="absolute w-3 h-3 bg-cyan-400 rounded-full" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos((i / 8) * 2 * Math.PI) * 80, y: Math.sin((i / 8) * 2 * Math.PI) * 80, opacity: 0, scale: 0.5 }} transition={{ duration: 0.5, ease: "easeOut" }} />
            ))}
        </motion.div>
    );
};

const DbConnectionModal: FC<DbConnectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [dbName, setDbName] = useState('');
    const [dbHost, setDbHost] = useState('localhost');
    const [dbDatabase, setDbDatabase] = useState('');
    const [dbUser, setDbUser] = useState('');
    const [dbPassword, setDbPassword] = useState('');
    const [dbPort, setDbPort] = useState(5432);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ db_name: dbName, db_host: dbHost, db_database: dbDatabase, db_user: dbUser, db_password: dbPassword, db_port: dbPort });
        onClose();
        setDbName(''); setDbHost('localhost'); setDbDatabase(''); setDbUser(''); setDbPassword(''); setDbPort(5432);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl shadow-cyan-500/10">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">New Database Connection</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input type="text" placeholder="Connection Name (e.g., 'Production DB')" value={dbName} onChange={e => setDbName(e.target.value)} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <input type="text" placeholder="Host" value={dbHost} onChange={e => setDbHost(e.target.value)} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <input type="text" placeholder="Database Name" value={dbDatabase} onChange={e => setDbDatabase(e.target.value)} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <input type="text" placeholder="User" value={dbUser} onChange={e => setDbUser(e.target.value)} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <input type="password" placeholder="Password" value={dbPassword} onChange={e => setDbPassword(e.target.value)} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <input type="number" placeholder="Port" value={dbPort} onChange={e => setDbPort(parseInt(e.target.value))} required className="w-full bg-gray-800 border-gray-700 rounded-md p-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors">Cancel</button>
                                <button type="submit" className="text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg px-4 py-2 transition-colors">Save Connection</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const isComplex = typeof message.content === 'object';
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-cyan-900/80 text-white rounded-lg p-3 max-w-2xl"><p>{message.content as string}</p></div>
            </div>
        );
    }

    const contentData = message.content as LlmResponseData;

    return (
        <>
            <div className="flex justify-start">
                <div className="bg-gray-800/80 rounded-lg p-4 max-w-2xl w-full space-y-3">
                    {isComplex ? (
                        <>
                            <p>
                                I found <strong>{contentData.rows_returned}</strong> results from the 
                                <code> {contentData.inferred_table} </code> table in the 
                                <code> {contentData.inferred_db_name} </code> database.
                                {contentData.source.includes('cache') && <span className="text-cyan-400 text-xs ml-2">⚡️ Cached</span>}
                            </p>
                            <motion.div>
                                <h4 className="text-sm font-semibold flex items-center space-x-2 mb-2"><CodeIcon /><span>Generated SQL</span></h4>
                                <pre className="bg-black/50 p-3 rounded-md text-xs text-gray-300 overflow-x-auto"><code>{contentData.sql_query}</code></pre>
                            </motion.div>
                            {contentData.data && contentData.data.length > 0 && (
                                <div className="w-full overflow-x-auto max-h-60 border border-gray-700 rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-700/50 sticky top-0"><tr>{Object.keys(contentData.data[0]).map(key => <th key={key} className="p-2">{key}</th>)}</tr></thead>
                                        <tbody>
                                            {contentData.data.slice(0, 5).map((row, i) => (
                                                <tr key={i} className="border-b border-gray-700/50">{Object.values(row).map((val, j) => <td key={j} className="p-2 whitespace-nowrap">{String(val)}</td>)}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button onClick={() => setIsTableModalOpen(true)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"><ExpandIcon /><span>View Full Table</span></button>
                            </div>
                        </>
                    ) : ( <p>{message.content as string}</p> )}
                </div>
            </div>
            {isComplex && <InteractiveTableModal data={contentData.data} isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} />}
        </>
    );
};

const InteractiveTableModal: FC<InteractiveTableModalProps> = ({ data, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredData = React.useMemo(() => 
        data.filter(row => 
            Object.values(row).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        ), [data, searchTerm]);

    const downloadCSV = () => {
        if (filteredData.length === 0) return;
        const headers = Object.keys(filteredData[0]);
        const csvRows = [headers.join(','), ...filteredData.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'query_results.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-4xl h-5/6 shadow-2xl shadow-cyan-500/10 flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input type="text" placeholder="Search table..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded-md p-2 pl-8 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                                    <div className="absolute left-2.5 top-2.5 text-gray-400"><SearchIcon /></div>
                                </div>
                                <button onClick={downloadCSV} className="flex items-center space-x-2 text-sm bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"><DownloadIcon /><span>Download CSV</span></button>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><CloseIcon /></button>
                        </div>
                        <div className="p-4 flex-grow overflow-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-700/50 sticky top-0"><tr>{Object.keys(data[0] || {}).map(key => <th key={key} className="p-2 whitespace-nowrap">{key}</th>)}</tr></thead>
                                <tbody>
                                    {filteredData.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-700/50">{Object.values(row).map((val, j) => <td key={j} className="p-2 whitespace-nowrap">{String(val)}</td>)}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DashboardPage;