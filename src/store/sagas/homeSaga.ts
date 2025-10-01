import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHomeStart, fetchHomeSuccess, fetchHomeFailure, HomeContentData } from '../slices/homeSlice';

async function fetchHomeAPI(): Promise<HomeContentData> {
  const res = await fetch('/api/mock/home.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch home content');
  return res.json();
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


