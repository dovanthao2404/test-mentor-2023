import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
import counterReducer from './demo/a';

export const store: EnhancedStore = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
