import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './user/slice';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import loadingReducer from './loading/slice';
import messageReducer from './message/slice';
import { useSelector } from 'react-redux';
import projectReducer from './project/slice';
import drawerReducer from './drawer/slice';
import masterReducer from './master/slice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    loading: loadingReducer,
    message: messageReducer,
    project: projectReducer,
    drawer: drawerReducer,
    master: masterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

type AppStateDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = (): AppStateDispatch => useDispatch<AppStateDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
