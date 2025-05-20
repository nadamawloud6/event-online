import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AppInitializer from './components/AppInitializer';
import DataInitializer from './components/DataInitializer';
import NavigationTracker from './components/NavigationTracker';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventParticipantsPage from './pages/EventParticipantsPage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50', // Green
      light: '#80e27e',
      dark: '#087f23',
    },
    info: {
      main: '#2196f3', // Light Blue
      light: '#6ec6ff',
      dark: '#0069c0',
    },
    warning: {
      main: '#ff9800', // Orange
      light: '#ffc947',
      dark: '#c66900',
    },
    error: {
      main: '#f44336', // Red
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Évite les boutons en majuscules
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Coins arrondis pour tous les composants
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Boutons avec coins très arrondis
          padding: '8px 16px',
          boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16)',
        },
        contained: {
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
          '&:hover': {
            boxShadow: '0 6px 10px 4px rgba(0, 0, 0, .15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataInitializer>
          <AppInitializer>
            <Router>
              <NavigationTracker />
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/events/create"
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <CreateEventPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/events/edit/:id"
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <EditEventPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/events/:id/participants"
                    element={
                      <ProtectedRoute requiredRole="Admin">
                        <EventParticipantsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </AppInitializer>
        </DataInitializer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
