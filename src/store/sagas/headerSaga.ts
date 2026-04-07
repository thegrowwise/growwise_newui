import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHeaderRequested, fetchHeaderSucceeded, fetchHeaderFailed } from '../slices/headerSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchHeaderApi() {
  try {
    return await fetchJsonWithLocale<any>('header.json', '/header');
  } catch {
    // growwise_backend may not expose GET /header — fall back to committed mock JSON.
    return fetchJsonWithLocale<any>('header.json', undefined);
  }
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


