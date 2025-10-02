import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import contentReducer from './slices/contentSlice';
import homeReducer from './slices/homeSlice';
import headerReducer from './slices/headerSlice';
import contactReducer from './slices/contactSlice';
import aboutReducer from './slices/aboutSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    content: contentReducer,
    home: homeReducer,
    header: headerReducer,
    about: aboutReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
});

// Only run sagas on the client side
if (typeof window !== 'undefined') {
  sagaMiddleware.run(rootSaga);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 