import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google Provider
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';

// Your Google Client ID obtained from the credentials file
const googleClientId = "213201513168-arh1c87n3kme1vluv4at2blprdh5rmrg.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}> {/* Wrap with Google Provider */}
      <BrowserRouter> {/* Wrap everything with BrowserRouter */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
