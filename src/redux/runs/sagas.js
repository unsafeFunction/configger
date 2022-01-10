import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
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
    yield put({ type: actions.FETCH_RUNS_FAILURE });
    notification.error({
      message: error.message,
    });
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
    yield put({
      type: actions.PUBLISH_RUN_FAILURE,
      payload: {
        runId: payload.runId,
      },
    });
    notification.error({
      message: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_RUNS_REQUEST, callLoadRuns),
    takeEvery(actions.PUBLISH_RUN_REQUEST, callPublishRun),
  ]);
}
