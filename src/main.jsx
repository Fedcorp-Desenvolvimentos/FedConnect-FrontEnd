// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import ScrollToTop from './utils/scrolltop';
import App from './App.jsx';
import { SnackbarProvider } from 'notistack';
import { GlobalStyles } from './styles/GlobalStyles';
import { GoogleOAuthProvider } from '@react-oauth/google';

const isDevelopment = process.env.NODE_ENV === 'development';

ReactDOM.createRoot(document.getElementById('root')).render(
  isDevelopment ? (
    <React.StrictMode>
      <GlobalStyles />
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <GlobalProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId="765602112412-336nt6annegl11j5s3ffm5lie68a975q.apps.googleusercontent.com">
              <ScrollToTop />
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <App />
              </SnackbarProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </GlobalProvider>
      </Router>
    </React.StrictMode>
  ) : (
    <>
      <GlobalStyles />
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <GlobalProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId="765602112412-336nt6annegl11j5s3ffm5lie68a975q.apps.googleusercontent.com">
              <ScrollToTop />
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <App />
              </SnackbarProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </GlobalProvider>
      </Router>
    </>
  )
);