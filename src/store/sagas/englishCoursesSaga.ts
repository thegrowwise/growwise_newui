import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchEnglishCoursesRequested, fetchEnglishCoursesSucceeded, fetchEnglishCoursesFailed } from '../slices/englishCoursesSlice';
import { fetchJsonWithLocale } from '@/lib/api';

function* fetchEnglishCoursesSaga() {
  try {
    console.log('Fetching English courses data...');
    const data = yield call(fetchJsonWithLocale, 'english-courses');
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
