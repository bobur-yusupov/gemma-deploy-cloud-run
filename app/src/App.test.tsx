import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Explain This Code/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders code input placeholder', () => {
  render(<App />);
  const textareaElement = screen.getByPlaceholderText(/Paste your code here/i);
  expect(textareaElement).toBeInTheDocument();
});
