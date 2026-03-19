import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import ScrollToTop from './utils/scrolltop';
import App from './App.jsx';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <GlobalProvider>
        <AuthProvider>
          <ScrollToTop />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </GlobalProvider>
    </Router>
  </React.StrictMode>
); 