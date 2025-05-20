import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  event: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action) => {
      state.loading = false;
      state.events = action.payload;
    },
    fetchEventsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventSuccess: (state, action) => {
      state.loading = false;
      state.event = action.payload;
    },
    fetchEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEventSuccess: (state, action) => {
      state.loading = false;
      state.events = [...state.events, action.payload];
    },
    createEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEventSuccess: (state, action) => {
      state.loading = false;
      state.events = state.events.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
      state.event = action.payload;
    },
    updateEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEventSuccess: (state, action) => {
      state.loading = false;
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    deleteEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = eventSlice.actions;

export default eventSlice.reducer;
