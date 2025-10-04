import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchEnglishCoursesRequested, fetchEnglishCoursesSucceeded, fetchEnglishCoursesFailed } from '../slices/englishCoursesSlice';
import { fetchJsonWithLocale } from '@/lib/api';

function* fetchEnglishCoursesSaga() {
  try {
    console.log('Fetching English courses data...');
    const response = yield call(fetch, '/api/english-courses');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = yield call([response, 'json']);
    console.log('English courses data fetched:', data);
    yield put(fetchEnglishCoursesSucceeded(data));
  } catch (error) {
    console.error('Error fetching English courses data:', error);
    yield put(fetchEnglishCoursesFailed(error instanceof Error ? error.message : 'Failed to fetch English courses data'));
  }
}

export function* watchFetchEnglishCourses() {
  yield takeEvery(fetchEnglishCoursesRequested.type, fetchEnglishCoursesSaga);
}
