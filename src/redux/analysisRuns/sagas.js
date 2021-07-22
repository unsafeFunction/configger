import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import modalActions from 'redux/modal/actions';
import {
  fetchRun,
  fetchRuns,
  updateRun,
  updateSample,
  uploadRunResult,
} from 'services/analysisRuns';
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

    notification.error({
      message: error.message,
    });
  }
}

export function* callUpdateSample({ payload }) {
  const { id, field } = payload;
  try {
    const response = yield call(updateSample, payload);

    yield put({
      type: actions.UPDATE_SAMPLE_SUCCESS,
      payload: {
        field,
        data: response.data,
      },
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Sample updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_SAMPLE_FAILURE,
      payload: {
        id,
        field,
      },
    });

    notification.error({
      message: error.message ?? 'Sample not updated',
    });
  }
}

export function* callUpdateRun({ payload }) {
  try {
    const response = yield call(updateRun, payload);

    yield put({
      type: actions.UPDATE_RUN_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    notification.success({
      message: 'Run updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_RUN_FAILURE,
    });

    notification.error({
      message: error.message ?? 'Run not updated',
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_RUNS_REQUEST, callLoadRuns)]);
  yield all([
    takeEvery(actions.UPLOAD_RUN_RESULT_REQUEST, callUploadRunResult),
  ]);
  yield all([takeEvery(actions.FETCH_RUN_REQUEST, callLoadRun)]);
  yield all([takeEvery(actions.UPDATE_SAMPLE_REQUEST, callUpdateSample)]);
  yield all([takeEvery(actions.UPDATE_RUN_REQUEST, callUpdateRun)]);
}
