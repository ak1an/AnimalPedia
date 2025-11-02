import { store } from './store';
import { toggleTheme, setTheme } from './slices/themeSlice';
import { setQuery, setSuggestions, setIsSearching, clearSearch } from './slices/searchSlice';
import { addRecentlyViewedAnimal, clearRecentlyViewed } from './slices/recentlyViewedSlice';

describe('Redux Store', () => {
  test('should handle theme toggle', () => {
    const initialState = store.getState().theme;
    expect(initialState.isDarkMode).toBe(false);
    
    store.dispatch(toggleTheme());
    const newState = store.getState().theme;
    expect(newState.isDarkMode).toBe(true);
  });

  test('should handle theme set', () => {
    store.dispatch(setTheme(false));
    const initialState = store.getState().theme;
    expect(initialState.isDarkMode).toBe(false);
    
    store.dispatch(setTheme(true));
    const newState = store.getState().theme;
    expect(newState.isDarkMode).toBe(true);
  });

  test('should handle search actions', () => {
    const testQuery = 'test animal';
    const testSuggestions = ['test1', 'test2'];
    
    store.dispatch(setQuery(testQuery));
    const queryState = store.getState().search;
    expect(queryState.query).toBe(testQuery);
    
    store.dispatch(setSuggestions(testSuggestions));
    const suggestionsState = store.getState().search;
    expect(suggestionsState.suggestions).toEqual(testSuggestions);
    
    store.dispatch(setIsSearching(true));
    const searchingState = store.getState().search;
    expect(searchingState.isSearching).toBe(true);
    
    store.dispatch(clearSearch());
    const clearedState = store.getState().search;
    expect(clearedState.query).toBe('');
    expect(clearedState.suggestions).toEqual([]);
    expect(clearedState.isSearching).toBe(false);
  });

  test('should handle recently viewed animals', () => {
    const testAnimal = {
      id: '1',
      name: 'Test Animal',
      category: 'mammals',
      habitat: 'forest',
      photo: 'test.jpg',
      short: 'Test description',
      details: 'Test details'
    };
    
    store.dispatch(addRecentlyViewedAnimal(testAnimal));
    const addedState = store.getState().recentlyViewed;
    expect(addedState.animals).toContainEqual(testAnimal);
    
    store.dispatch(clearRecentlyViewed());
    const clearedState = store.getState().recentlyViewed;
    expect(clearedState.animals).toEqual([]);
  });
});