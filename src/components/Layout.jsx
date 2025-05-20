import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide,
  Fade,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { logout } from '../services/authService';

// Composant pour cacher la barre de navigation lors du défilement
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const open = Boolean(anchorEl);

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
    setMobileDrawerOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
    setMobileDrawerOpen(false);
  };

  const handleDashboard = () => {
    if (user && user.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
    handleClose();
    setMobileDrawerOpen(false);
  };

  // Vérifier si le chemin actuel est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={scrolled ? 4 : 0}
          sx={{
            transition: 'all 0.3s ease-in-out',
            bgcolor: scrolled ? 'primary.main' : 'primary.main',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
          }}
        >
          <Toolbar>
            <Fade in={true} timeout={1000}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography
                  variant="h5"
                  component={Link}
                  to="/"
                  sx={{
                    flexGrow: 1,
                    textDecoration: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  Event Online
                </Typography>
              </Box>
            </Fade>

            {/* Menu de navigation pour les écrans moyens et grands */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, flexGrow: 1 }}>
              <Tooltip title="Accueil">
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  sx={{
                    mx: 1,
                    borderBottom: isActive('/') ? '2px solid white' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.5)'
                    }
                  }}
                  startIcon={<HomeIcon />}
                >
                  Accueil
                </Button>
              </Tooltip>

              <Tooltip title="Événements">
                <Button
                  color="inherit"
                  component={Link}
                  to="/events"
                  sx={{
                    mx: 1,
                    borderBottom: isActive('/events') ? '2px solid white' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.5)'
                    }
                  }}
                  startIcon={<EventIcon />}
                >
                  Événements
                </Button>
              </Tooltip>

              {isAuthenticated && (
                <Tooltip title="Tableau de bord">
                  <Button
                    color="inherit"
                    component={Link}
                    to={user?.role === 'Admin' ? '/admin/dashboard' : '/dashboard'}
                    sx={{
                      mx: 1,
                      borderBottom: isActive('/dashboard') || isActive('/admin/dashboard') ? '2px solid white' : 'none',
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.5)'
                      }
                    }}
                    startIcon={user?.role === 'Admin' ? <AdminIcon /> : <DashboardIcon />}
                  >
                    {user?.role === 'Admin' ? 'Admin' : 'Tableau de bord'}
                  </Button>
                </Tooltip>
              )}
            </Box>

            {/* Boutons d'authentification pour les écrans moyens et grands */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title={user?.name || 'Utilisateur'}>
                    <IconButton
                      onClick={handleMenu}
                      color="inherit"
                      edge="end"
                      sx={{
                        ml: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: user?.role === 'Admin' ? 'secondary.main' : 'primary.light',
                          border: '2px solid white'
                        }}
                      >
                        {user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        mt: 1
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1, bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {user?.name || 'Utilisateur'}
                      </Typography>
                      <Typography variant="caption">
                        {user?.email || 'email@example.com'}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Profil</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDashboard} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        {user?.role === 'Admin' ? <AdminIcon fontSize="small" /> : <DashboardIcon fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText>Tableau de bord</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText>Déconnexion</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{
                      mx: 1,
                      borderRadius: '20px',
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/register"
                    sx={{
                      ml: 1,
                      borderRadius: '20px',
                      px: 2,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                      }
                    }}
                    startIcon={<RegisterIcon />}
                  >
                    Inscription
                  </Button>
                </>
              )}
            </Box>

            {/* Menu hamburger pour les petits écrans */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                color="inherit"
                onClick={toggleMobileDrawer}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Tiroir de navigation mobile */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: {
            width: '75%',
            maxWidth: 300,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EventIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Event Online
            </Typography>
          </Box>

          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: user?.role === 'Admin' ? 'secondary.main' : 'primary.main',
                  mr: 2
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.name || 'Utilisateur'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'email@example.com'}
                </Typography>
              </Box>
            </Box>
          )}

          <List component="nav" sx={{ flexGrow: 1 }}>
            <ListItem
              button
              component={Link}
              to="/"
              onClick={toggleMobileDrawer}
              selected={isActive('/')}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/events"
              onClick={toggleMobileDrawer}
              selected={isActive('/events')}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Événements" />
            </ListItem>

            {isAuthenticated ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    handleDashboard();
                    toggleMobileDrawer();
                  }}
                  selected={isActive('/dashboard') || isActive('/admin/dashboard')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '& .MuiListItemIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    {user?.role === 'Admin' ? <AdminIcon /> : <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText primary={user?.role === 'Admin' ? 'Administration' : 'Tableau de bord'} />
                </ListItem>

                <ListItem
                  button
                  onClick={() => {
                    handleProfile();
                    toggleMobileDrawer();
                  }}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profil" />
                </ListItem>

                <Divider sx={{ my: 2 }} />

                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: 'error.main',
                    '& .MuiListItemIcon-root': {
                      color: 'error.main'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Déconnexion" />
                </ListItem>
              </>
            ) : (
              <>
                <Divider sx={{ my: 2 }} />

                <ListItem
                  button
                  component={Link}
                  to="/login"
                  onClick={toggleMobileDrawer}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Connexion" />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/register"
                  onClick={toggleMobileDrawer}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon>
                    <RegisterIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inscription" />
                </ListItem>
              </>
            )}
          </List>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto', textAlign: 'center' }}>
            © {new Date().getFullYear()} Event Online
          </Typography>
        </Box>
      </Drawer>

      {/* Espace pour compenser la barre de navigation fixe */}
      <Toolbar />

      {/* Contenu principal */}
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        {children}
      </Container>

      {/* Pied de page */}
      <Box
        component="footer"
        sx={{
          py: 4,
          bgcolor: 'background.paper',
          mt: 'auto',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary" fontWeight="bold">
                Event Online
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button size="small" component={Link} to="/">Accueil</Button>
              <Button size="small" component={Link} to="/events">Événements</Button>
              {isAuthenticated ? (
                <Button size="small" component={Link} to="/dashboard">Tableau de bord</Button>
              ) : (
                <Button size="small" component={Link} to="/login">Connexion</Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Event Online. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
