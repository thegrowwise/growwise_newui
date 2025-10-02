import { all } from 'redux-saga/effects';
import { watchFetchContent } from './contentSaga';
import { watchFetchHome } from './homeSaga';
import { watchFetchHeader } from './headerSaga';
import { watchFetchAbout } from './aboutSaga';
import { watchFetchContact } from './contactSaga';

export default function* rootSaga() {
  yield all([
    watchFetchContent(),
    watchFetchHome(),
    watchFetchHeader(),
    watchFetchAbout(),
    watchFetchContact(),
  ]);
} 