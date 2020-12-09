import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
  fetchPoolsByRunId,
  fetchPoolsByCompanyId,
  publishPool,
} from 'services/pools';
// import cookieStorage from 'utils/cookie';
import actions from './actions';

// const cookie = cookieStorage();

export function* callLoadPoolsByRunId({ payload }) {
  try {
    const response = yield call(fetchPoolsByRunId, payload);

    yield put({
      type: actions.FETCH_POOLS_BY_RUN_ID_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callLoadPoolsByCompanyId({ payload }) {
  try {
    const response = yield call(fetchPoolsByCompanyId, payload);

    yield put({
      type: actions.FETCH_POOLS_BY_COMPANY_ID_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callPublishPool({ payload }) {
  try {
    const response = yield call(publishPool, payload);

    yield put({
      type: actions.PUBLISH_POOL_SUCCESS,
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
    takeEvery(actions.FETCH_POOLS_BY_RUN_ID_REQUEST, callLoadPoolsByRunId),
    takeEvery(
      actions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
      callLoadPoolsByCompanyId,
    ),
    takeEvery(actions.PUBLISH_POOL_REQUEST, callPublishPool),
  ]);
}
