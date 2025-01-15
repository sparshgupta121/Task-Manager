
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PlusCircle, ListTodo, AlertTriangle, Clock } from 'lucide-react';
import { addTask } from '../store/slices/tasksSlice';
import { Task } from '../types';
import { motion } from 'framer-motion';

const TaskInput: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      priority,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    dispatch(addTask(newTask));
    
    // Save to localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));
    
    setTitle('');
    setPriority('medium');
    setDueDate('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}
    >
      <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
        <ListTodo className="h-6 w-6 text-blue-500" />
        Add New Task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
      Task Title
    </label>
    <input
      id="title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Enter task title and press Enter..."
      className={`w-full px-4 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
    />
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label htmlFor="priority" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} mb-2`}>
        Priority Level
      </label>
      <div className="relative">
        <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
          className={`w-full pl-10 pr-4 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none`}
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>
    </div>
    
    <div>
      <label htmlFor="dueDate" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} mb-2`}>
        Due Date (Optional)
      </label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        />
      </div>
    </div>
  </div>
  
  <motion.button
    type="submit"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`w-full px-6 py-3 ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2`}
  >
    <PlusCircle size={20} />
    Add Task
  </motion.button>
</form>
    </motion.div>
  );
};

export default TaskInput;

