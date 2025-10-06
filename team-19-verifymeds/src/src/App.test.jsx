import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Verify Your Medicine/i)).toBeInTheDocument();
  });
});