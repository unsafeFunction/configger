import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchRackScans, fetchRackScan, updateRackScan } from 'services/racks';
import modalActions from 'redux/modal/actions';
import { getRackScan } from './selectors';
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

    const formatResponse = (response) => {
      return Object.assign(
        {},
        ...response?.map?.((obj) => ({
          letter: obj?.position?.[0],
          [`col${obj?.position?.[1]}`]: {
            ...obj,
            status: obj?.status,
          },
        })),
      );
    };

    const tubesInfo = data?.pools;

    const preparedResponse = [
      formatResponse(tubesInfo?.slice?.(0, 8)),
      formatResponse(tubesInfo?.slice?.(8, 16)),
      formatResponse(tubesInfo?.slice?.(16, 24)),
      formatResponse(tubesInfo?.slice?.(24, 32)),
      formatResponse(tubesInfo?.slice?.(32, 40)),
      formatResponse(tubesInfo?.slice?.(40, 48)),
    ];

    yield put({
      type: actions.GET_RACK_SUCCESS,
      payload: { ...data, items: preparedResponse },
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

export function* callUpdateRack({ payload }) {
  try {
    const rack = yield select(getRackScan);
    const { data } = yield call(updateRackScan, rack);

    yield put({
      type: actions.UPDATE_RACK_SUCCESS,
      payload: data,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });
  } catch (error) {
    notification.error(error);

    yield put({
      type: actions.UPDATE_RACK_FAILURE,
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
    takeEvery(actions.UPDATE_RACK_REQUEST, callUpdateRack),
  ]);
}
