import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchSteamRequested, fetchSteamSucceeded, fetchSteamFailed } from '../slices/steamSlice';
import { fetchJsonWithLocale } from '@/lib/api';

function* fetchSteamSaga() {
  try {
    console.log('Fetching STEAM data...');
    const data = yield call(fetchJsonWithLocale, 'steam');
    console.log('STEAM data fetched:', data);
    yield put(fetchSteamSucceeded(data));
  } catch (error) {
    console.error('Error fetching STEAM data:', error);
    yield put(fetchSteamFailed(error instanceof Error ? error.message : 'Failed to fetch STEAM data'));
  }
}

export function* watchFetchSteam() {
  yield takeEvery(fetchSteamRequested.type, fetchSteamSaga);
}
