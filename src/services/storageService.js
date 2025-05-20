// Clés utilisées pour le stockage local
const STORAGE_KEYS = {
  EVENTS: 'eventonline_events',
  REGISTRATIONS: 'eventonline_registrations',
  USERS: 'eventonline_users',
  NAVIGATION: 'eventonline_navigation',
};

// Données par défaut (utilisées si aucune donnée n'est trouvée dans le localStorage)
import { mockEvents as defaultEvents } from './mockData/eventsMock';
import { mockRegistrations as defaultRegistrations } from './mockData/registrationsMock';
import { mockUsers as defaultUsers } from './mockData/usersMock';

/**
 * Récupère les données depuis le localStorage ou utilise les valeurs par défaut
 * @param {string} key - Clé de stockage
 * @param {Array|Object} defaultValue - Valeur par défaut si aucune donnée n'est trouvée
 * @returns {Array|Object} - Données récupérées ou valeur par défaut
 */
export const getStoredData = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Enregistre les données dans le localStorage
 * @param {string} key - Clé de stockage
 * @param {Array|Object} data - Données à stocker
 */
export const storeData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement des données (${key}):`, error);
  }
};

// Fonctions spécifiques pour chaque type de données
export const getEvents = () => getStoredData(STORAGE_KEYS.EVENTS, defaultEvents);
export const storeEvents = (events) => storeData(STORAGE_KEYS.EVENTS, events);

export const getRegistrations = () => getStoredData(STORAGE_KEYS.REGISTRATIONS, defaultRegistrations);
export const storeRegistrations = (registrations) => storeData(STORAGE_KEYS.REGISTRATIONS, registrations);

export const getUsers = () => getStoredData(STORAGE_KEYS.USERS, defaultUsers);
export const storeUsers = (users) => storeData(STORAGE_KEYS.USERS, users);

// Fonctions pour la navigation
export const getCurrentPath = () => localStorage.getItem(STORAGE_KEYS.NAVIGATION) || '/';
export const storeCurrentPath = (path) => localStorage.setItem(STORAGE_KEYS.NAVIGATION, path);

// Fonction pour réinitialiser toutes les données (utile pour le développement/test)
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.NAVIGATION);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentPath');
};

export default {
  getEvents,
  storeEvents,
  getRegistrations,
  storeRegistrations,
  getUsers,
  storeUsers,
  getCurrentPath,
  storeCurrentPath,
  resetAllData,
  STORAGE_KEYS,
};
