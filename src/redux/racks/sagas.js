import { notification } from 'antd';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import modalActions from 'redux/modal/actions';
import {
  deleteRack,
  fetchRackScan,
  fetchRackScans,
  updateRackScan,
} from 'services/racks';
import labConfig from 'utils/labConfig';
import actions from './actions';
import { getRackScan } from './selectors';

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
          [`col${obj?.position?.substr(1)}`]: {
            ...obj,
            status: obj?.status,
          },
        })),
      );
    };

    const tubesInfo = data?.tubes;

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

    notification.success({
      message: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} updated`,
    });

    if (payload.callback) {
      payload.callback();
    }
  } catch (error) {
    yield put({
      type: actions.UPDATE_RACK_FAILURE,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.error({
      message:
        error.message ??
        `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} not updated`,
    });
  }
}

export function* callDeleteRack({ payload }) {
  try {
    yield call(deleteRack, payload);

    yield put({
      type: actions.DELETE_RACK_BY_ID_SUCCESS,
      payload: {
        id: payload.id,
      },
    });

    notification.success({
      message: 'Rack was deleted successfully!',
    });
  } catch (error) {
    yield put({
      type: actions.DELETE_RACK_BY_ID_FAILURE,
      payload: {
        error,
      },
    });

    throw new Error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_RACKS_REQUEST, callFetchRacks),
    takeEvery(actions.GET_RACK_REQUEST, callFetchRack),
    takeEvery(actions.UPDATE_RACK_REQUEST, callUpdateRack),
    takeEvery(actions.DELETE_RACK_BY_ID_REQUEST, callDeleteRack),
  ]);
}
