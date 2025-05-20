import React, { useEffect } from 'react';
import { getEvents, storeEvents, getRegistrations, storeRegistrations } from '../services/storageService';
import { mockEvents } from '../services/mockData/eventsMock';
import { mockRegistrations } from '../services/mockData/registrationsMock';

/**
 * Composant qui initialise les données dans le localStorage au démarrage de l'application
 * si elles n'existent pas déjà
 */
const DataInitializer = ({ children }) => {
  useEffect(() => {
    // Initialiser les événements s'ils n'existent pas déjà dans le localStorage
    const storedEvents = getEvents();
    if (!storedEvents || storedEvents.length === 0) {
      storeEvents(mockEvents);
      console.log('Événements initialisés dans le localStorage');
    }

    // Initialiser les inscriptions si elles n'existent pas déjà dans le localStorage
    const storedRegistrations = getRegistrations();
    if (!storedRegistrations || storedRegistrations.length === 0) {
      storeRegistrations(mockRegistrations);
      console.log('Inscriptions initialisées dans le localStorage');
    }
  }, []);

  return <>{children}</>;
};

export default DataInitializer;
