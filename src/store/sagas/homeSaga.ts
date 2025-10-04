import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHomeStart, fetchHomeSuccess, fetchHomeFailure, HomeContentData } from '../slices/homeSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchHomeAPI(): Promise<HomeContentData> {
  return fetchJsonWithLocale<HomeContentData>('home.json', '/home');
}

function* fetchHomeSaga() {
  try {
    const content: HomeContentData = yield call(fetchHomeAPI);
    yield put(fetchHomeSuccess(content));
  } catch (error) {
    yield put(fetchHomeFailure(error instanceof Error ? error.message : 'Failed to fetch home content'));
  }
}

export function* watchFetchHome() {
  yield takeLatest(fetchHomeStart.type, fetchHomeSaga);
}


