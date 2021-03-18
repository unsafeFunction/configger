import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import { notification } from 'antd';
import actions from './actions';
import modalActions from 'redux/modal/actions';
import {
  deleteTube,
  fetchScanById,
  updateTube,
  deleteScan,
  updateScan,
  invalidateTube,
  fetchSessionId,
  cancelScan,
} from 'services/scans';
import {
  fetchSessions,
  fetchSessionById,
  updateSession,
  createSession,
  closeSession
} from 'services/scanSessions';
import { getSelectedCode } from './selectors';
import sortBy from 'lodash.sortby';
import { constants } from 'utils/constants';

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

    yield put({
      type: actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS,
      payload: {
        ...response?.data,
        scans: [
          ...sortBy(response?.data?.scans, 'scan_order').map?.((scan) => {
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
    throw new Error(error);
  }
}

export function* callUpdateSession({ payload }) {
  try {
    let response = null;

    if (payload.isSaveSession) {
      response = yield call(updateSession, payload);
    } else {
      response = yield call(closeSession, payload);
    }

    yield put({
      type: actions.UPDATE_SESSION_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    if (payload.callback) {
      yield put({
        type: actions.FETCH_SESSION_ID_SUCCESS,
        payload: {
          sessionId: null,
        },
      });

      payload.callback();
    }
    yield put({
      type: modalActions.HIDE_MODAL,
    });

    if (payload.isSaveSession) {
      notification.success({
        message: 'Session updated',
      });
    } else {
      notification.success({
        message: 'Session canceled',
      });
    }

  } catch (error) {
    yield put({
      type: actions.UPDATE_SESSION_FAILURE,
      payload: {
        error,
      },
    });

    throw new Error(error);
  }
}

export function* callFetchScanById({ payload }) {
  try {
    const response = yield call(fetchScanById, payload);

    const tubesInfo = response?.data?.scan_tubes;

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

    const preparedResponse = [
      formatResponse(tubesInfo?.slice?.(0, 8)),
      formatResponse(tubesInfo?.slice?.(8, 16)),
      formatResponse(tubesInfo?.slice?.(16, 24)),
      formatResponse(tubesInfo?.slice?.(24, 32)),
      formatResponse(tubesInfo?.slice?.(32, 40)),
      formatResponse(tubesInfo?.slice?.(40, 48)),
    ];

    yield put({
      type: actions.FETCH_SCAN_BY_ID_SUCCESS,
      payload: {
        ...response?.data,
        items: preparedResponse,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callUpdateTube({ payload }) {
  try {
    const response = yield call(updateTube, payload);

    const poolingTube =
      response?.data?.status === constants.tubeStatuses.pooling;

    yield put({
      type: actions.UPDATE_TUBE_SUCCESS,
      payload: {
        data: {
          row: {
            letter: response?.data?.position?.[0],
            [`col${response?.data?.position?.[1]}`]: {
              ...response?.data,
              status: response?.data?.status,
            },
          },
          tube: response.data,
          scanId: payload.data.scanId,
          ...(poolingTube ? { pool_id: response?.data?.tube_id } : {}),
        },
      },
    });

    notification.success({
      message: 'Tube updated',
    });
  } catch (error) {
    notification.error({
      message: 'Something went wrong',
    });

    throw Error(error);
  }
}

export function* callInvalidateTube({ payload }) {
  try {
    const selectedCode = yield select(getSelectedCode);
    const response = yield call(invalidateTube, {
      ...payload,
      data: {
        status: selectedCode.status,
      },
    });

    yield put({
      type: actions.INVALIDATE_TUBE_SUCCESS,
      payload: {
        data: {
          row: {
            letter: response?.data?.position?.[0],
            [`col${response?.data?.position?.[1]}`]: {
              ...response?.data,
              status: response?.data?.status,
              color: response?.data?.color,
            },
          },
          scanId: payload.scanId,
          tube: response.data,
        },
      },
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });
  } catch (error) {
    notification.error({
      message: 'Something went wrong',
    });

    throw Error(error);
  }
}

export function* callFetchSessionId() {
  try {
    const response = yield call(fetchSessionId);

    yield put({
      type: actions.FETCH_SESSION_ID_SUCCESS,
      payload: {
        sessionId: response?.data?.session_id,
      },
    });
  } catch (error) {
    notification.error({
      message: 'Something went wrong',
    });

    throw Error(error);
  }
}

export function* callCreateSession({ payload }) {
  try {
    const response = yield call(createSession, payload);

    yield put({
      type: actions.CREATE_SESSION_SUCCESS,
      payload: {
        sessionId: response?.data?.id,
      },
    });

    notification.success({
      message: 'Session was created.',
    });
  } catch (error) {
    notification.error({
      message: 'Something was wrong',
    });

    throw Error(error);
  }
}

export function* callDeleteTube({ payload }) {
  try {
    const response = yield call(deleteTube, payload);

    yield put({
      type: actions.DELETE_TUBE_SUCCESS,
      payload: {
        data: {
          tube: response.data,
          scanId: payload.scanId,
          tubeId: payload.tubeId,
        },
      },
    });

    notification.success({
      message: 'Tube deleted',
    });
  } catch (error) {
    yield put({
      type: actions.DELETE_TUBE_FAILURE,
      payload: {
        data: error.message ?? null,
      },
    });

    notification.error({
      message: error.message ?? 'Failure!',
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

    throw new Error(error);
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

    yield put({
      type: modalActions.HIDE_MODAL,
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

    throw new Error(error);
  }
}

export function* callCancelScan({ payload }) {
  try {
    const response = yield call(cancelScan, payload);

    yield put({
      type: actions.CANCEL_SCAN_BY_ID_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    notification.success({
      message: 'Scan updated',
    });
  } catch (error) {
    yield put({
      type: actions.CANCEL_SCAN_BY_ID_FAILURE,
      payload: {
        error,
      },
    });

    throw new Error(error);
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
    takeEvery(actions.INVALIDATE_TUBE_REQUEST, callInvalidateTube),
    takeEvery(actions.CREATE_SESSION_REQUEST, callCreateSession),
    takeEvery(actions.FETCH_SESSION_ID_REQUEST, callFetchSessionId),
    takeEvery(actions.CANCEL_SCAN_BY_ID_REQUEST, callCancelScan),
  ]);
}
