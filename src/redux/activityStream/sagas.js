import { all, takeEvery, takeLatest, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchActivityByUserId } from 'services/activityStream';
import { fetchUserById } from 'services/user';
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

export function* callLoadUserById({ payload }) {
  try {
    const response = yield call(fetchUserById, payload.userId);
    yield put({
      type: actions.FETCH_USER_BY_ID_SUCCESS,
      payload: {
        user: response.data,
      },
    });
  } catch (error) {
    return error;
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      actions.FETCH_ACTIVITY_BY_USER_ID_REQUEST,
      callLoadActivityByUserId,
    ),
    takeEvery(actions.FETCH_USER_BY_ID_REQUEST, callLoadUserById),
  ]);
}
