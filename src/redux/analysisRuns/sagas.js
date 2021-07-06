import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchRuns, uploadRunResult } from 'services/analysisRuns';
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
    yield call(uploadRunResult, payload);

    yield put({
      type: actions.UPLOAD_RUN_RESULT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: actions.UPLOAD_RUN_RESULT_ERROR,
    });
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_RUNS_REQUEST, callLoadRuns)]);
  yield all([
    takeEvery(actions.UPLOAD_RUN_RESULT_REQUEST, callUploadRunResult),
  ]);
}
