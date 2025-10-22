import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchFooterRequested, fetchFooterSucceeded, fetchFooterFailed } from '../slices/footerSlice';
import { FooterData } from '@/components/layout/Footer/types';

function* fetchFooterSaga() {
  try {
    const response: Response = yield call(fetch, '/api/mock/footer');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: FooterData = yield call([response, 'json']);
    yield put(fetchFooterSucceeded(data));
  } catch (error) {
    yield put(fetchFooterFailed(error instanceof Error ? error.message : 'Failed to fetch footer data'));
  }
}

export function* watchFetchFooter() {
  yield takeEvery(fetchFooterRequested.type, fetchFooterSaga);
}
