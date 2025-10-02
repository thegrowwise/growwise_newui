import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAcademicFailed, fetchAcademicRequested, fetchAcademicSucceeded, AcademicData } from '../slices/academicSlice';

function fetchAcademicApi(): Promise<AcademicData> {
  return fetch('/api/mock/academic.json').then((res) => {
    if (!res.ok) throw new Error('Failed to fetch academic');
    return res.json();
  });
}

function* fetchAcademicWorker() {
  try {
    const data: AcademicData = yield call(fetchAcademicApi);
    yield put(fetchAcademicSucceeded(data));
  } catch (err: any) {
    yield put(fetchAcademicFailed(err?.message ?? 'Unknown error'));
  }
}

export function* watchFetchAcademic() {
  yield takeLatest(fetchAcademicRequested.type, fetchAcademicWorker);
}


