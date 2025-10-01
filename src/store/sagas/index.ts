import { all } from 'redux-saga/effects';
import { watchFetchContent } from './contentSaga';
import { watchFetchHome } from './homeSaga';

export default function* rootSaga() {
  yield all([
    watchFetchContent(),
    watchFetchHome(),
  ]);
} 