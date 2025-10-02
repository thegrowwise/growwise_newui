import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAboutRequested, fetchAboutSucceeded, fetchAboutFailed } from '../slices/aboutSlice';

function fetchAboutApi() {
  return fetch('/api/mock/about.json', { cache: 'no-store' }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

function* handleFetchAbout() {
  try {
    const data: any = yield call(fetchAboutApi);
    yield put(fetchAboutSucceeded(data));
  } catch (err: any) {
    yield put(fetchAboutFailed(err.message || 'Failed to load about'));
  }
}

export function* watchFetchAbout() {
  yield takeLatest(fetchAboutRequested.type, handleFetchAbout);
}


