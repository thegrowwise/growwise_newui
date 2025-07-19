import { all } from 'redux-saga/effects';
import { watchFetchContent } from './contentSaga';

export default function* rootSaga() {
  yield all([
    watchFetchContent(),
  ]);
} 