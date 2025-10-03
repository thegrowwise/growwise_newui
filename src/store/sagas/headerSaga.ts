import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHeaderRequested, fetchHeaderSucceeded, fetchHeaderFailed } from '../slices/headerSlice';

function fetchHeaderApi() {
  return fetch('/api/mock/header.json', { cache: 'no-store' }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
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


