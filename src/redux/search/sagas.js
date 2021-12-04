import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchInfo } from 'services/search';
import actions from './actions';

export function* callFetchInfo({ payload }) {
  try {
    const response = yield call(fetchInfo, payload);

    yield put({
      type: actions.FETCH_INFO_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_INFO_FAILURE,
      payload: {
        data: error.message,
      },
    });
    notification.error({ message: error.message });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_INFO_REQUEST, callFetchInfo)]);
}
