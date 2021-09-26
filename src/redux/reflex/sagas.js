import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  fetchReflexDetails,
  fetchReflexList,
  updateSample,
} from 'services/reflex';
import actions from './actions';

export function* callLoadReflexList({ payload }) {
  try {
    const response = yield call(fetchReflexList, payload);

    yield put({
      type: actions.FETCH_REFLEX_LIST_SUCCESS,
      payload: {
        data: response.data,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_REFLEX_LIST_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export function* callUpdateSample({ payload }) {
  try {
    const response = yield call(updateSample, payload);

    yield put({
      type: actions.UPDATE_REFLEX_SAMPLE_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    notification.success({
      message: 'Sample updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_REFLEX_SAMPLE_FAILURE,
      payload: {
        id: payload.id,
      },
    });

    notification.error({
      message: error.message ?? 'Sample not updated',
    });
  }
}

export function* callLoadReflexDetails({ payload }) {
  try {
    const response = yield call(fetchReflexDetails, payload);

    yield put({
      type: actions.FETCH_REFLEX_DETAILS_SUCCESS,
      payload: {
        data: response?.data,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_REFLEX_DETAILS_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_REFLEX_LIST_REQUEST, callLoadReflexList),
    takeEvery(actions.UPDATE_REFLEX_SAMPLE_REQUEST, callUpdateSample),
    takeEvery(actions.FETCH_REFLEX_DETAILS_REQUEST, callLoadReflexDetails),
  ]);
}
