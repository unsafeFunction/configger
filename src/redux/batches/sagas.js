import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchBatches, publishBatch } from 'services/batch';
import cookieStorage from 'utils/cookie';
import actions from './actions';

const cookie = cookieStorage();

export function* callLoadBatches({ payload }) {
  try {
    const response = yield call(fetchBatches, payload);
    // const response = yield call(fetchBatches);

    yield put({
      type: actions.FETCH_BATCHES_SUCCESS,
      payload: {
        data: response.data,
        // total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callPublishBatch({ payload }) {
  try {
    const response = yield call(publishBatch, payload);

    yield put({
      type: actions.PUBLISH_BATCH_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_BATCHES_REQUEST, callLoadBatches),
    takeEvery(actions.PUBLISH_BATCH_REQUEST, callPublishBatch),
  ]);
}
