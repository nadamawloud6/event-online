import api from './api';
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchEventStart,
  fetchEventSuccess,
  fetchEventFailure,
  createEventStart,
  createEventSuccess,
  createEventFailure,
  updateEventStart,
  updateEventSuccess,
  updateEventFailure,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFailure,
} from '../store/slices/eventSlice';

// Importer le service de stockage pour la persistance des données
import { getEvents, storeEvents } from './storageService';

export const fetchEvents = () => async (dispatch) => {
  try {
    dispatch(fetchEventsStart());

    // In a real app, this would be an API call
    // const response = await api.get('/events');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les événements depuis le localStorage
    const events = getEvents();

    dispatch(fetchEventsSuccess(events));
  } catch (error) {
    dispatch(fetchEventsFailure(error.message));
  }
};

export const fetchEvent = (id) => async (dispatch) => {
  try {
    dispatch(fetchEventStart());

    // In a real app, this would be an API call
    // const response = await api.get(`/events/${id}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les événements depuis le localStorage
    const events = getEvents();
    const event = events.find(event => String(event.id) === String(id));

    if (!event) {
      throw new Error('Événement non trouvé');
    }

    dispatch(fetchEventSuccess(event));
  } catch (error) {
    dispatch(fetchEventFailure(error.message));
  }
};

export const createEvent = (eventData) => async (dispatch) => {
  try {
    dispatch(createEventStart());

    // In a real app, this would be an API call
    // const response = await api.post('/events', eventData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer un nouvel événement
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
    };

    // Récupérer les événements existants et ajouter le nouvel événement
    const events = getEvents();
    const updatedEvents = [...events, newEvent];

    // Sauvegarder les événements mis à jour dans le localStorage
    storeEvents(updatedEvents);

    dispatch(createEventSuccess(newEvent));
    return { success: true, event: newEvent };
  } catch (error) {
    dispatch(createEventFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const updateEvent = (id, eventData) => async (dispatch) => {
  try {
    dispatch(updateEventStart());

    // In a real app, this would be an API call
    // const response = await api.put(`/events/${id}`, eventData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les événements depuis le localStorage
    const events = getEvents();
    const existingEvent = events.find(event => String(event.id) === String(id));

    if (!existingEvent) {
      throw new Error('Événement non trouvé');
    }

    const updatedEvent = {
      ...existingEvent,
      ...eventData,
      updatedAt: new Date().toISOString(),
    };

    // Mettre à jour l'événement dans la liste
    const updatedEvents = events.map(event =>
      String(event.id) === String(id) ? updatedEvent : event
    );

    // Sauvegarder les événements mis à jour dans le localStorage
    storeEvents(updatedEvents);

    dispatch(updateEventSuccess(updatedEvent));
    return { success: true, event: updatedEvent };
  } catch (error) {
    dispatch(updateEventFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteEventStart());

    // In a real app, this would be an API call
    // await api.delete(`/events/${id}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les événements depuis le localStorage
    const events = getEvents();

    // Filtrer pour supprimer l'événement
    const updatedEvents = events.filter(event => String(event.id) !== String(id));

    // Sauvegarder les événements mis à jour dans le localStorage
    storeEvents(updatedEvents);

    dispatch(deleteEventSuccess(id));
    return { success: true };
  } catch (error) {
    dispatch(deleteEventFailure(error.message));
    return { success: false, error: error.message };
  }
};
