import axios from 'axios';

// The URL where your FastAPI backend is running.
const API_URL = 'http://127.0.0.1:8000';

/**
 * A centralized Axios instance for making API requests.
 * You can add interceptors here later for global error handling
 * or to automatically attach the auth token.
 */
const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches the list of database configurations for the logged-in user.
 * Corresponds to the /list-dbs endpoint.
 * @param {string} token - The user's JWT access token.
 * @returns {Promise<Array>} A promise that resolves to an array of databases.
 */
export const getUserDatabases = async (token) => {
  try {
    const response = await apiClient.get('/list-dbs', {
      headers: { 'token': token }
    });
    // The backend returns an object like { "databases": [...] }
    return response.data.databases;
  } catch (error) {
    console.error("Error fetching databases:", error.response?.data?.detail || error.message);
    // Return an empty array or throw the error, depending on how you want to handle it
    return [];
  }
};

/**
 * Saves a new database configuration for the user.
 * Corresponds to the /save-db-config endpoint.
 * @param {string} token - The user's JWT access token.
 * @param {object} config - The database configuration details.
 * @returns {Promise<boolean>} A promise that resolves to true if successful.
 */
export const saveDbConfig = async (token, config) => {
  try {
    await apiClient.post('/save-db-config', config, {
      headers: { 'token': token }
    });
    return true;
  } catch (error) {
    console.error("Error saving DB config:", error.response?.data?.detail || error.message);
    // You could show an alert or notification to the user here
    alert(`Failed to save configuration: ${error.response?.data?.detail || error.message}`);
    return false;
  }
};

/**
 * Sends a user's natural language query to the backend for processing.
 * Corresponds to the /ask endpoint.
 * @param {string} token - The user's JWT access token.
 * @param {string} prompt - The user's query.
 * @param {Array} history - The recent conversation history.
 * @returns {Promise<object|null>} A promise that resolves to the LLM's response object.
 */
export const askLlm = async (token, prompt, history) => {
  const payload = {
    user_query: prompt,
    conversation_history: history || []
  };
  try {
    const response = await apiClient.post('/ask', payload, {
      headers: { 'token': token }
    });
    // The backend returns the full response object directly
    return response.data;
  } catch (error) {
    console.error("Error asking LLM:", error.response?.data?.detail || error.message);
    return {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.response?.data?.detail || 'Please check the server.'}`
    };
  }
};