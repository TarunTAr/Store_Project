// src/store/index.js
// Redux Toolkit store + redux-persist — no JSX here.

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

// redux-persist
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

const rootReducer = combineReducers({
  ui: uiReducer,
  // Add other reducers here (e.g. auth: authReducer)
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui'] // persist only ui slice for now
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // required for redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// persistor for PersistGate
export const persistor = persistStore(store);

export default store;
