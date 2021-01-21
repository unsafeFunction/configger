import { all, takeEvery, put, call } from 'redux-saga/effects';
import { fetchIntake } from 'services/intakeLims';
import { notification } from 'antd';
import actions from './actions';

export function* callFetchIntake({ payload }) {
  try {
    const response = yield call(fetchIntake, payload);
    yield put({
      type: actions.FETCH_INTAKE_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_INTAKE_REQUEST, callFetchIntake)]);
}
