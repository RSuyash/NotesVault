import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
// Removed GoogleOAuthProvider import
import './index.css';
import App from './App.js';
import { ThemeProvider } from './context/ThemeContext.js';

// Removed googleClientId constant

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Removed GoogleOAuthProvider wrapper */}
    <BrowserRouter> {/* Wrap everything with BrowserRouter */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
