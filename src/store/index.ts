import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import contentReducer from './slices/contentSlice';
import homeReducer from './slices/homeSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    content: contentReducer,
    home: homeReducer,
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