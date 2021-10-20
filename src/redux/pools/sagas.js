import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import modalActions from 'redux/modal/actions';
import {
  fetchPools,
  fetchPoolsByCompanyId,
  fetchPoolsByRunId,
  fetchResultList,
  publishPool,
  updatePoolResult,
} from 'services/pools';
import actions from './actions';

export function* callLoadPoolsByRunId({ payload }) {
  try {
    const response = yield call(fetchPoolsByRunId, payload);
    yield put({
      type: actions.FETCH_POOLS_BY_RUN_ID_SUCCESS,
      payload: {
        filename: response.data.import_filename,
        data: response.data,
        firstPage: !response.data.previous,
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
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_POOLS_BY_COMPANY_ID_FAILURE });
    notification.error({
      message: error.message,
    });
  }
}

export function* callPublishPool({ payload }) {
  try {
    const response = yield call(publishPool, payload);

    yield put({
      type: actions.PUBLISH_POOL_SUCCESS,
      payload: {
        data: response.data,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
    notification.success({
      message: 'Pool updated',
    });
  } catch (error) {
    yield put({
      type: actions.PUBLISH_POOL_FAILURE,
      payload: {
        poolId: payload.poolId,
      },
    });
    notification.error(error);
  }
}

export function* callFetchResultList({ payload }) {
  try {
    const response = yield call(fetchResultList, payload);

    yield put({
      type: actions.FETCH_RESULT_LIST_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callUpdatePoolResult({ payload }) {
  try {
    const response = yield call(updatePoolResult, payload);

    yield put({
      type: actions.UPDATE_POOL_RESULT_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Pool updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_POOL_RESULT_FAILURE,
      payload: {
        poolId: payload.poolId,
      },
    });
    notification.error(error);
  }
}

export function* callFetchAllPools({ payload }) {
  try {
    const response = yield call(fetchPools, payload);

    yield put({
      type: actions.FETCH_ALL_POOLS_SUCCESS,
      payload: {
        data: response.data,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_ALL_POOLS_FAILURE });
    notification.error({
      message: error.message,
    });
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
    takeEvery(actions.FETCH_RESULT_LIST_REQUEST, callFetchResultList),
    takeEvery(actions.UPDATE_POOL_RESULT_REQUEST, callUpdatePoolResult),
    takeEvery(actions.FETCH_ALL_POOLS_REQUEST, callFetchAllPools),
  ]);
}
