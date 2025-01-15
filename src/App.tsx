import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, CheckSquare, Sun, Moon, Menu, X } from 'lucide-react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import LoginForm from './components/Auth/LoginForm';
import { RootState } from './store';
import { loginSuccess, logout } from './store/slices/authSlice';
import { setTasks } from './store/slices/tasksSlice';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    }

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      dispatch(setTasks(JSON.parse(storedTasks)));
    }

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  if (!isAuthenticated) {
    return <LoginForm darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="flex items-center">
                <CheckSquare className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h1 className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Task Manager</h1>
              </span>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className={`rounded-md p-2 inline-flex items-center justify-center ${darkMode ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            <nav className="hidden md:flex space-x-10 items-center">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center`}>
                  <span className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} font-medium`}>
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user?.name}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed inset-y-0 right-0 w-full max-w-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-50 md:hidden`}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="px-4 py-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="flex items-center">
                      <CheckSquare className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h1 className={`ml-2 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Task Manager</h1>
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-md p-2 inline-flex items-center justify-center ${darkMode ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <nav className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center`}>
                        <span className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} text-xl font-medium`}>
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>{user?.name}</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                      <span className="flex items-center gap-3">
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {darkMode ? 'On' : 'Off'}
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <LogOut size={24} />
                      Logout
                    </button>
                  </nav>
                </div>
                <div className={`px-4 py-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    &copy; 2023 Task Manager. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <TaskInput darkMode={darkMode} />
        <TaskList darkMode={darkMode} />
      </main>
    </div>
  );
}

export default App;

