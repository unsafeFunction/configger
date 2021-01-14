import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
  fetchInfo
} from 'services/search';
import actions from './actions';

export function* callFetchInfo({ payload }) {
  try {
    const response = yield call(fetchInfo, payload);

    yield put({
      type: actions.FETCH_INFO_SUCCESS,
      payload: {
        data: response.data,
        total: response.data.count,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_INFO_REQUEST, callFetchInfo),
  ]);
}
