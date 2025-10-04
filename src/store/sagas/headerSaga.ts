import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHeaderRequested, fetchHeaderSucceeded, fetchHeaderFailed } from '../slices/headerSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchHeaderApi() {
  return fetchJsonWithLocale<any>('header.json', '/header');
}

function* handleFetchHeader() {
  try {
    const data: ReturnType<typeof JSON.parse> = yield call(fetchHeaderApi);
    yield put(fetchHeaderSucceeded(data as any));
  } catch (err: any) {
    yield put(fetchHeaderFailed(err.message || 'Failed to load header'));
  }
}

export function* watchFetchHeader() {
  yield takeLatest(fetchHeaderRequested.type, handleFetchHeader);
}


