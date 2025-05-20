import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginSuccess } from '../services/authService';

// Ce composant est responsable de l'initialisation de l'application
// Il vérifie si un token est présent dans le localStorage et tente de récupérer
// les informations de l'utilisateur si nécessaire
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Fonction pour initialiser l'authentification
    const initializeAuth = async () => {
      try {
        // Si nous avons un token mais pas d'utilisateur, essayons de restaurer la session
        if (token && !user) {
          // Récupérer l'utilisateur du localStorage
          const storedUser = localStorage.getItem('user');

          if (storedUser) {
            // Si nous avons un utilisateur stocké, restaurons la session directement
            dispatch(loginSuccess({ user: JSON.parse(storedUser), token }));
          } else {
            // Sinon, simulons une connexion basée sur le token
            if (token.includes('admin')) {
              await dispatch(login({ email: 'admin@example.com', password: 'password' }));
            } else {
              await dispatch(login({ email: 'user@example.com', password: 'password' }));
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        // Marquer l'initialisation comme terminée
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch, token, user]);

  // Afficher un indicateur de chargement pendant l'initialisation
  if (!isInitialized && token) {
    return <div>Chargement de votre session...</div>;
  }

  return <>{children}</>;
};

export default AppInitializer;
