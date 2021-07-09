import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchRun, fetchRuns, uploadRunResult } from 'services/analysisRuns';
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

export function* callUploadRunResult({ payload }) {
  try {
    const { data } = yield call(uploadRunResult, payload);

    yield put({
      type: actions.UPLOAD_RUN_RESULT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: actions.UPLOAD_RUN_RESULT_ERROR,
    });
    notification.error(error);
  }
}

export function* callLoadRun({ payload }) {
  try {
    const response = yield call(fetchRun, payload);

    yield put({
      type: actions.FETCH_RUN_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_RUN_FAILURE });
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_RUNS_REQUEST, callLoadRuns)]);
  yield all([
    takeEvery(actions.UPLOAD_RUN_RESULT_REQUEST, callUploadRunResult),
  ]);
  yield all([takeEvery(actions.FETCH_RUN_REQUEST, callLoadRun)]);
}
