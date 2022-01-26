import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import modalActions from 'redux/modal/actions';
import {
  fetchRun,
  fetchRuns,
  fetchWellplate,
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

    notification.success({ message: 'Successfully loaded' });
  } catch (error) {
    notification.error({ message: error.message, duration: null });
  }
}

export function* callLoadRun({ payload }) {
  try {
    const response = yield call(fetchRun, payload.id);

    yield put({
      type: actions.FETCH_RUN_SUCCESS,
      payload: {
        data: { ...response.data, id: payload.id },
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_RUN_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export function* callFetchWellplate({ payload }) {
  try {
    const { data } = yield call(fetchWellplate, payload.id);

    const formatResponse = (response) => {
      return Object.assign(
        {},
        ...response?.map?.((obj) => ({
          letter: obj?.position?.[0],
          [`col${obj?.position?.substr(1)}`]: {
            ...obj,
            status: obj?.status,
          },
        })),
      );
    };

    const wellplates = data?.items;

    const preparedResponse = wellplates.map((wellplate) => {
      const step = wellplate.length === 48 ? 6 : 12;

      return [
        formatResponse(wellplate?.slice?.(0, step)),
        formatResponse(wellplate?.slice?.(step, step * 2)),
        formatResponse(wellplate?.slice?.(step * 2, step * 3)),
        formatResponse(wellplate?.slice?.(step * 3, step * 4)),
        formatResponse(wellplate?.slice?.(step * 4, step * 5)),
        formatResponse(wellplate?.slice?.(step * 5, step * 6)),
        formatResponse(wellplate?.slice?.(step * 6, step * 7)),
        formatResponse(wellplate?.slice?.(step * 7, step * 8)),
      ];
    });

    yield put({
      type: actions.FETCH_WELLPLATE_SUCCESS,
      payload: {
        data: preparedResponse,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_WELLPLATE_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export function* callUpdateSample({ payload }) {
  const { id, field } = payload;
  try {
    yield put({
      type: modalActions.HIDE_MODAL,
    });

    const response = yield call(updateSample, payload);

    yield put({
      type: actions.UPDATE_SAMPLE_SUCCESS,
      payload: {
        field,
        data: response.data,
      },
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
  yield all([takeEvery(actions.FETCH_WELLPLATE_REQUEST, callFetchWellplate)]);
}
