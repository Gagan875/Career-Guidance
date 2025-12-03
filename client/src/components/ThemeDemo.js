import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeDemo = () => {
  const { theme, isDark } = useTheme();

  return (
    <div className="card max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Theme Demo Component
      </h3>
      
      <div className="space-y-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current theme: <span className="font-medium capitalize">{theme}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dark mode: {isDark ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        <div className="space-y-2">
          <button className="btn-primary w-full">
            Primary Button
          </button>
          <button className="btn-secondary w-full">
            Secondary Button
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sample Input
          </label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type something..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded">
            Primary Color
          </div>
          <div className="p-2 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 rounded">
            Secondary Color
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;