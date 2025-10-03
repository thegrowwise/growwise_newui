import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchContactFailed, fetchContactRequested, fetchContactSucceeded, ContactData } from '../slices/contactSlice';

function fetchContactApi(): Promise<ContactData> {
  return fetch('/api/mock/contact.json').then((res) => {
    if (!res.ok) throw new Error('Failed to fetch contact');
    return res.json();
  });
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


