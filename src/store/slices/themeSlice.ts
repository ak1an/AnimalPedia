import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

// Load initial state from localStorage if available
const loadInitialState = (): ThemeState => {
  try {
    const savedTheme = localStorage.getItem('animalPediaTheme');
    if (savedTheme !== null) {
      return { isDarkMode: JSON.parse(savedTheme) };
    }
  } catch (error) {
    console.error('Error loading theme from localStorage:', error);
  }
  // Default to light mode
  return { isDarkMode: false };
};

const initialState: ThemeState = loadInitialState();

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Save to localStorage
      try {
        localStorage.setItem('animalPediaTheme', JSON.stringify(state.isDarkMode));
        // Apply theme class to body
        if (state.isDarkMode) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem('animalPediaTheme', JSON.stringify(state.isDarkMode));
        // Apply theme class to body
        if (state.isDarkMode) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;