import { all } from 'redux-saga/effects';
import { watchFetchContent } from './contentSaga';
import { watchFetchHome } from './homeSaga';
import { watchFetchHeader } from './headerSaga';
import { watchFetchAbout } from './aboutSaga';
import { watchFetchContact } from './contactSaga';
import { watchFetchAcademic } from './academicSaga';
import { watchFetchEnglishCourses } from './englishCoursesSaga';
import { watchFetchMathCourses } from './mathCoursesSaga';
import { watchFetchSteam } from './steamSaga';
import { watchFetchFooter } from './footerSaga';

export default function* rootSaga() {
  yield all([
    watchFetchContent(),
    watchFetchHome(),
    watchFetchHeader(),
    watchFetchAbout(),
    watchFetchContact(),
    watchFetchAcademic(),
    watchFetchEnglishCourses(),
    watchFetchMathCourses(),
    watchFetchSteam(),
    watchFetchFooter(),
  ]);
} 