import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchAcademicFailed, fetchAcademicRequested, fetchAcademicSucceeded, AcademicData } from '../slices/academicSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchAcademicApi(): Promise<AcademicData> {
  return fetchJsonWithLocale<AcademicData>('academic.json', '/academic');
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


