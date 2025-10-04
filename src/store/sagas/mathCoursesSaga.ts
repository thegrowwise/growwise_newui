import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchMathCoursesRequested, fetchMathCoursesSucceeded, fetchMathCoursesFailed } from '../slices/mathCoursesSlice';
import { fetchJsonWithLocale } from '@/lib/api';

function* fetchMathCoursesSaga() {
  try {
    console.log('Fetching Math courses data...');
    const data = yield call(fetchJsonWithLocale, 'math-courses');
    console.log('Math courses data fetched:', data);
    yield put(fetchMathCoursesSucceeded(data));
  } catch (error) {
    console.error('Error fetching Math courses data:', error);
    yield put(fetchMathCoursesFailed(error instanceof Error ? error.message : 'Failed to fetch Math courses data'));
  }
}

export function* watchFetchMathCourses() {
  yield takeEvery(fetchMathCoursesRequested.type, fetchMathCoursesSaga);
}
