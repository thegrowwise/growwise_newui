import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import contentReducer from './slices/contentSlice';
import homeReducer from './slices/homeSlice';
import headerReducer from './slices/headerSlice';
import contactReducer from './slices/contactSlice';
import academicReducer from './slices/academicSlice';
import aboutReducer from './slices/aboutSlice';
import englishCoursesReducer from './slices/englishCoursesSlice';
import mathCoursesReducer from './slices/mathCoursesSlice';
import steamReducer from './slices/steamSlice';
import footerReducer from './slices/footerSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    content: contentReducer,
    home: homeReducer,
    header: headerReducer,
    about: aboutReducer,
    contact: contactReducer,
    academic: academicReducer,
    englishCourses: englishCoursesReducer,
    mathCourses: mathCoursesReducer,
    steam: steamReducer,
    footer: footerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
});

// Defer saga run to avoid blocking initial parse/compile/execution (reduces TBT/JS execution time).
// Run after first paint via requestIdleCallback so the main thread is free for LCP.
if (typeof window !== 'undefined') {
  const runSaga = () => sagaMiddleware.run(rootSaga);
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(runSaga, { timeout: 800 });
  } else {
    setTimeout(runSaga, 1);
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 