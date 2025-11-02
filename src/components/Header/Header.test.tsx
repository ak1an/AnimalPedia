import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { Header } from './index';

/**
 * Test suite for the Header component
 */
describe('Header Component', () => {
  // Mock window.matchMedia for dark mode testing
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    
    // Check if the header element is rendered
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders the logo', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    
    // Check if the logo is rendered
    expect(screen.getByText('AnimalPedia')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    
    // Check if navigation links are rendered
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Red Book')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Mini Games')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    
    // Check if theme toggle button is rendered
    const themeToggle = screen.getByLabelText('Switch to dark mode');
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders user profile component', () => {
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    
    // Check if user profile component is rendered
    expect(screen.getByLabelText('User profile')).toBeInTheDocument();
  });
});