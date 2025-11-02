import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import searchReducer from './slices/searchSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    search: searchReducer,
    recentlyViewed: recentlyViewedReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;