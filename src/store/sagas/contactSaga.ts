import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchContactFailed, fetchContactRequested, fetchContactSucceeded, ContactData } from '../slices/contactSlice';
import { fetchJsonWithLocale } from '@/lib/api';

async function fetchContactApi(): Promise<ContactData> {
  return fetchJsonWithLocale<ContactData>('contact.json', '/contact');
}

function* fetchContactWorker() {
  try {
    const data: ContactData = yield call(fetchContactApi);
    yield put(fetchContactSucceeded(data));
  } catch (err: any) {
    yield put(fetchContactFailed(err?.message ?? 'Unknown error'));
  }
}

export function* watchFetchContact() {
  yield takeLatest(fetchContactRequested.type, fetchContactWorker);
}


