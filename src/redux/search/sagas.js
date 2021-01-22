import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
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
        data: error?.response?.data?.error,
      },
    });
    notification.error({ message: error?.response?.data?.error });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_INFO_REQUEST, callFetchInfo)]);
}
