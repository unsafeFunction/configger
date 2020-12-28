import { all, takeLatest, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchActivityByUserId } from 'services/activityStream';
import actions from './actions';

export function* callLoadActivityByUserId({ payload }) {
  try {
    const response = yield call(fetchActivityByUserId, payload);

    yield put({
      type: actions.FETCH_ACTIVITY_BY_USER_ID_SUCCESS,
      payload: {
        data: response.data,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    const errorData = error.response.data;

    yield put({
      type: actions.FETCH_ACTIVITY_BY_USER_ID_FAILURE,
      payload: {
        error: errorData?.detail,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData?.detail,
    });

    return error;
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      actions.FETCH_ACTIVITY_BY_USER_ID_REQUEST,
      callLoadActivityByUserId,
    ),
  ]);
}
