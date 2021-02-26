import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchRackScans, fetchRackScan } from 'services/racks';
import actions from './actions';

export function* callFetchRacks({ payload }) {
  try {
    const { data } = yield call(fetchRackScans, payload);

    yield put({
      type: actions.FETCH_RACKS_SUCCESS,
      payload: {
        data: data?.results ?? [],
        total: data.count,
        firstPage: !data.previous,
      },
    });
  } catch (error) {
    notification.error(error);

    yield put({
      type: actions.FETCH_RACKS_FAILURE,
      payload: {
        error,
      },
    });
  }
}

export function* callFetchRack({ payload }) {
  try {
    const { data } = yield call(fetchRackScan, payload);

    yield put({
      type: actions.GET_RACK_SUCCESS,
      payload: {
        data: data?.results ?? [],
        total: data.count,
        firstPage: !data.previous,
      },
    });
  } catch (error) {
    notification.error(error);

    yield put({
      type: actions.GET_RACK_FAILURE,
      payload: {
        error,
      },
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_RACKS_REQUEST, callFetchRacks),
    takeEvery(actions.GET_RACK_REQUEST, callFetchRack),
  ]);
}
