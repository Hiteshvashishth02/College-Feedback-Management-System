import { useState, useEffect } from 'react';

// Hook to manage localStorage with state synchronization
export function useLocalStorage(key, initialValue) {
  // Get stored value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook to manage dark mode preference
export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return [darkMode, toggleDarkMode];
}

// Hook to manage search history
export function useSearchHistory(maxItems = 10) {
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);

  const addToHistory = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;
    
    const term = searchTerm.trim().toLowerCase();
    
    setSearchHistory((currentHistory) => {
      // Remove existing occurrence if it exists
      const filtered = currentHistory.filter((item) => item !== term);
      
      // Add to beginning and limit to maxItems
      return [term, ...filtered].slice(0, maxItems);
    });
  };

  const removeFromHistory = (searchTerm) => {
    setSearchHistory((currentHistory) =>
      currentHistory.filter((item) => item !== searchTerm)
    );
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return [searchHistory, addToHistory, removeFromHistory, clearHistory];
}
