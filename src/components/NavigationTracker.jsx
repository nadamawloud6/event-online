import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCurrentPath } from '../store/slices/navigationSlice';

/**
 * Composant qui suit les changements de route et les enregistre dans le store Redux
 * Il restaure également la dernière route visitée lors de l'actualisation de la page
 */
const NavigationTracker = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPath } = useSelector((state) => state.navigation);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Suivre les changements de route et les enregistrer dans le store
  useEffect(() => {
    if (location.pathname !== currentPath) {
      dispatch(setCurrentPath(location.pathname));
    }
  }, [location.pathname, dispatch, currentPath]);

  // Restaurer la dernière route visitée lors du montage du composant
  useEffect(() => {
    // Vérifier si nous sommes sur la page d'accueil mais que nous avions une autre page enregistrée
    const shouldRedirect = location.pathname === '/' && currentPath !== '/' && currentPath !== '';

    // Liste des routes protégées qui nécessitent une authentification
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/admin/dashboard',
      '/admin/events/create',
    ];

    // Vérifier si la route est protégée et si l'utilisateur n'est pas authentifié
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    const canAccess = !isProtectedRoute || isAuthenticated;

    // Rediriger vers la dernière route visitée si possible
    if (shouldRedirect && canAccess) {
      navigate(currentPath, { replace: true });
    }
  }, [currentPath, location.pathname, navigate, isAuthenticated]);

  return null; // Ce composant ne rend rien
};

export default NavigationTracker;
