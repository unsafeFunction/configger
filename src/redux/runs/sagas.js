import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchRuns, publishRun } from 'services/runs';
import actions from './actions';

export function* callLoadRuns({ payload }) {
  try {
    const response = yield call(fetchRuns, payload);

    yield put({
      type: actions.FETCH_RUNS_SUCCESS,
      payload: {
        data: response.data,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callPublishRun({ payload }) {
  try {
    const response = yield call(publishRun, payload);

    yield put({
      type: actions.PUBLISH_RUN_SUCCESS,
      payload: {
        data: response.data,
      },
    });
    notification.success({
      message: 'Run updated',
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_RUNS_REQUEST, callLoadRuns),
    takeEvery(actions.PUBLISH_RUN_REQUEST, callPublishRun),
  ]);
}
