# Dark Mode Implementation Guide

This document outlines the dark mode implementation for the Digital Guidance Platform.

## Overview

The application now supports both light and dark themes with:
- Automatic theme detection based on system preferences
- Manual theme toggle
- Persistent theme preference storage
- Smooth transitions between themes
- Comprehensive dark mode styling across all components

## Implementation Details

### 1. Theme Context (`src/contexts/ThemeContext.js`)

The `ThemeProvider` manages the global theme state and provides:
- Theme state management (light/dark)
- System preference detection
- localStorage persistence
- Theme toggle functionality

### 2. Theme Toggle Component (`src/components/ThemeToggle.js`)

A reusable button component that:
- Displays appropriate icons for current theme
- Toggles between light and dark modes
- Includes accessibility features

### 3. Tailwind CSS Configuration

Updated `tailwind.config.js` to enable dark mode:
```javascript
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  // ... rest of config
}
```

### 4. CSS Classes and Utilities

Enhanced `index.css` with dark mode variants for:
- Button styles (`.btn-primary`, `.btn-secondary`)
- Card components (`.card`)
- Input fields (`.input-field`)
- Text and background utilities

## Usage

### Basic Implementation

1. **Wrap your app with ThemeProvider:**
```jsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

2. **Add theme toggle to navigation:**
```jsx
import ThemeToggle from './components/ThemeToggle';

const Navbar = () => {
  return (
    <nav>
      {/* Other nav items */}
      <ThemeToggle />
    </nav>
  );
};
```

3. **Use theme-aware classes:**
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content that adapts to theme
</div>
```

### Theme Hook

Use the `useTheme` hook to access theme state:
```jsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'light' : 'dark'} mode
      </button>
    </div>
  );
};
```

## Styling Guidelines

### Color Classes

Use these utility classes for consistent theming:

- **Text Colors:**
  - Primary text: `text-gray-900 dark:text-white`
  - Secondary text: `text-gray-600 dark:text-gray-400`
  - Muted text: `text-gray-500 dark:text-gray-500`

- **Background Colors:**
  - Primary background: `bg-white dark:bg-gray-800`
  - Secondary background: `bg-gray-50 dark:bg-gray-900`
  - Card background: Use the `.card` class

- **Border Colors:**
  - Primary borders: `border-gray-200 dark:border-gray-700`
  - Input borders: `border-gray-300 dark:border-gray-600`

### Component Classes

Use the predefined component classes:
- `.btn-primary` - Primary buttons with dark mode support
- `.btn-secondary` - Secondary buttons with dark mode support
- `.card` - Card containers with dark mode support
- `.input-field` - Form inputs with dark mode support

## Features

### Automatic Theme Detection
- Detects system color scheme preference on first visit
- Falls back to light mode if no preference is set

### Theme Persistence
- Saves user's theme preference in localStorage
- Restores theme on page reload/revisit

### Smooth Transitions
- CSS transitions for smooth theme switching
- Consistent animation duration across components

### Accessibility
- Proper ARIA labels on theme toggle button
- High contrast ratios in both themes
- Keyboard navigation support

## Browser Support

Dark mode is supported in:
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Customization

### Adding New Dark Mode Styles

1. **For new components:**
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  New component content
</div>
```

2. **For custom colors:**
```jsx
<div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
  Custom colored content
</div>
```

3. **For complex styling:**
```css
.my-component {
  @apply bg-white text-gray-900;
}

.dark .my-component {
  @apply bg-gray-800 text-white;
}
```

## Testing

Test dark mode implementation by:
1. Using the theme toggle button
2. Changing system preferences
3. Refreshing the page to test persistence
4. Testing with different screen sizes
5. Verifying accessibility with screen readers

## Future Enhancements

Potential improvements:
- Multiple theme options (not just light/dark)
- Theme scheduling (automatic switching based on time)
- Per-component theme overrides
- Theme-aware images and icons
- Custom color scheme builder