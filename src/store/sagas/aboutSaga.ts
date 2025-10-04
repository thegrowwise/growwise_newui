import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAboutRequested, fetchAboutSucceeded, fetchAboutFailed } from '../slices/aboutSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchAboutApi() {
  return fetchJsonWithLocale<any>('about.json', '/about');
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


