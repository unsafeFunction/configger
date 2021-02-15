import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import actions from './actions';
import {
  deleteTube,
  fetchScanById,
  updateTube,
  deleteScan,
  updateScan,
} from 'services/scans';
import {
  fetchSessions,
  fetchSessionById,
  updateSession,
} from 'services/scanSessions';
import sortBy from 'lodash.sortby';

export function* callFetchScanSessions({ payload }) {
  try {
    const { data } = yield call(fetchSessions, payload);

    yield put({
      type: actions.FETCH_SCAN_SESSIONS_SUCCESS,
      payload: {
        data: data?.results ?? [],
        total: data.count,
        firstPage: !data.previous,
      },
    });
  } catch (error) {
    notification.error(error);

    yield put({
      type: actions.FETCH_SCAN_SESSIONS_FAILURE,
      payload: {
        error,
      },
    });
  }
}

export function* callFetchScanSessionById({ payload }) {
  try {
    const response = yield call(fetchSessionById, payload.sessionId);

    const formatResponse = response => {
      return Object.assign(
        {},
        ...response?.map?.(obj => ({
          letter: obj?.position?.[0],
          [`col${obj?.position?.[1]}`]: {
            ...obj,
            status: obj?.status.toLowerCase(),
          },
        })),
      );
    };

    yield put({
      type: actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS,
      payload: {
        ...response?.data,
        scans: [
          ...sortBy(response?.data?.scans, 'scan_order').map?.(scan => {
            const tubesInfo = scan?.scan_tubes;
            return {
              ...scan,
              items: [
                formatResponse(tubesInfo?.slice?.(0, 8)),
                formatResponse(tubesInfo?.slice?.(8, 16)),
                formatResponse(tubesInfo?.slice?.(16, 24)),
                formatResponse(tubesInfo?.slice?.(24, 32)),
                formatResponse(tubesInfo?.slice?.(32, 40)),
                formatResponse(tubesInfo?.slice?.(40, 48)),
              ],
            };
          }),
        ],
      },
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_SCAN_SESSION_BY_ID_FAILURE,
    });

    notification.error(error);
    // throw Error(error);
  }
}

export function* callUpdateSession({ payload }) {
  try {
    const response = yield call(updateSession, payload);

    yield put({
      type: actions.UPDATE_SESSION_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    notification.success({
      message: 'Session updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_SESSION_FAILURE,
      payload: {
        error,
      },
    });

    throw Error(error);
  }
}

export function* callFetchScanById({ payload }) {
  try {
    const response = yield call(fetchScanById, payload);

    const tubesInfo = response?.data?.scan_tubes;

    const formatResponse = response => {
      return Object.assign(
        {},
        ...response?.map?.(obj => ({
          letter: obj?.position?.[0],
          [`col${obj?.position?.[1]}`]: {
            ...obj,
            status: obj?.status.toLowerCase(),
          },
        })),
      );
    };

    //TODO: refactor here...

    const preparedResponse = [
      formatResponse(tubesInfo?.slice?.(0, 8)),
      formatResponse(tubesInfo?.slice?.(8, 16)),
      formatResponse(tubesInfo?.slice?.(16, 24)),
      formatResponse(tubesInfo?.slice?.(24, 32)),
      formatResponse(tubesInfo?.slice?.(32, 40)),
      formatResponse(tubesInfo?.slice?.(40, 48)),
    ];
    console.log('prepared response', preparedResponse);

    yield put({
      type: actions.FETCH_SCAN_BY_ID_SUCCESS,
      payload: {
        ...response?.data,
        items: preparedResponse,
      },
    });
  } catch (error) {
    // console.log(error);
    notification.error(error);
  }
}

export function* callUpdateTube({ payload }) {
  // const { id, tube_id } = payload;
  try {
    const response = yield call(updateTube, payload);

    yield put({
      type: actions.UPDATE_TUBE_SUCCESS,
      payload: {
        data: {
          row: {
            letter: response?.data?.position?.[0],
            [`col${response?.data?.position?.[1]}`]: {
              ...response?.data,
              status: response?.data?.status?.toLowerCase(),
            },
          },
          scanId: payload.scanId,
        },
      },
    });

    notification.success({
      message: 'Tube updated',
    });
  } catch (error) {
    // is it necessary?
    yield put({
      type: actions.UPDATE_TUBE_FAILURE,
      payload: {
        letter: payload.position?.[0],
      },
    });

    notification.error({
      message: 'Something went wrong',
    });
    // notification.error(error);
  }
}

export function* callDeleteTube({ payload }) {
  try {
    const response = yield call(deleteTube, payload);

    console.log('call delete tube response', response);

    yield put({
      type: actions.DELETE_TUBE_SUCCESS,
      payload: {
        data: { ...response.data },
      },
    });

    notification.success({
      message: 'Tube deleted',
    });
  } catch (error) {
    console.log(error, payload);
    yield put({
      type: actions.DELETE_TUBE_FAILURE,
      payload: {
        letter: payload.position?.[0],
      },
    });

    notification.error({
      message: 'Something went wrong',
    });
  }
}

export function* callVoidScan({ payload }) {
  try {
    const response = yield call(deleteScan, payload);

    yield put({
      type: actions.VOID_SCAN_BY_ID_SUCCESS,
      payload: {
        data: {
          id: payload.id,
        },
      },
    });

    notification.success({
      message: 'Scan was voided',
    });
  } catch (error) {
    yield put({
      type: actions.VOID_SCAN_BY_ID_FAILURE,
      payload: {
        error,
      },
    });

    throw Error(error);
  }
}

export function* callUpdateScan({ payload }) {
  try {
    const response = yield call(updateScan, payload);

    yield put({
      type: actions.UPDATE_SCAN_BY_ID_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    notification.success({
      message: 'Scan updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_SCAN_BY_ID_SUCCESS,
      payload: {
        error,
      },
    });

    throw Error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_SCAN_SESSIONS_REQUEST, callFetchScanSessions),
    takeEvery(
      actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
      callFetchScanSessionById,
    ),
    takeEvery(actions.UPDATE_SESSION_REQUEST, callUpdateSession),
    takeEvery(actions.VOID_SCAN_BY_ID_REQUEST, callVoidScan),
    takeEvery(actions.UPDATE_SCAN_BY_ID_REQUEST, callUpdateScan),
    takeEvery(actions.FETCH_SCAN_BY_ID_REQUEST, callFetchScanById),
    takeEvery(actions.UPDATE_TUBE_REQUEST, callUpdateTube),
    takeEvery(actions.DELETE_TUBE_REQUEST, callDeleteTube),
  ]);
}
