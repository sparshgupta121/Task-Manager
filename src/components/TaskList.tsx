import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Edit2, Save, X, Clock, AlertTriangle } from 'lucide-react';
import { removeTask, setTasks } from '../store/slices/tasksSlice';
import { RootState } from '../store';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; priority: 'high' | 'medium' | 'low'; dueDate: string } | null>(null);

  const handleDelete = (taskId: string) => {
    dispatch(removeTask(taskId));
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = existingTasks.filter((task: Task) => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const startEditing = (task: Task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = (taskId: string) => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            title: editingTask.title,
            priority: editingTask.priority,
            dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString() : undefined,
          }
        : task
    );
    
    dispatch(setTasks(updatedTasks));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800';
      case 'medium':
        return darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800';
      case 'low':
        return darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h3 className={`text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No tasks yet</h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>Start by adding a new task above</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 sm:p-6 rounded-xl shadow-lg transition-all hover:shadow-xl`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 mb-4 sm:mb-0">
                {editingTask?.id === task.id ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="editTitle" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} mb-1`}>
                        Task Title
                      </label>
                      <input
                        id="editTitle"
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label htmlFor="editPriority" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} mb-1`}>
                        Priority
                      </label>
                      <select
                        id="editPriority"
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                        className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="editDueDate" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'} mb-1`}>
                        Due Date
                      </label>
                      <input
                        id="editDueDate"
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => saveEdit(task.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 ${darkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors flex items-center gap-2`}
                      >
                        <Save size={16} />
                        Save
                      </motion.button>
                      <motion.button
                        onClick={cancelEditing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} ${darkMode ? 'text-white' : 'text-gray-700'} rounded-lg transition-colors flex items-center gap-2`}
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3">
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                          task.priority
                        )} mt-2 sm:mt-0`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          Created: {formatDate(task.createdAt)}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <AlertTriangle className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                {editingTask?.id !== task.id && (
                  <motion.button
                    onClick={() => startEditing(task)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 ${darkMode ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'} rounded-lg transition-colors`}
                    title="Edit task"
                  >
                    <Edit2 size={20} />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => handleDelete(task.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 ${darkMode ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'} rounded-lg transition-colors`}
                  title="Delete task"
                >
                  <Trash2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskList;

