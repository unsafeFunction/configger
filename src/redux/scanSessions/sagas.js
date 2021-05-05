import { notification } from 'antd';
import sortBy from 'lodash.sortby';
import moment from 'moment-timezone';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { callFetchCompanyShort } from 'redux/companies/sagas';
import modalActions from 'redux/modal/actions';
import { fetchIntakeReceiptLog } from 'services/intakeReceiptLog';
import {
  deleteScan,
  deleteTube,
  fetchScanById,
  updateScan,
  updateTube,
} from 'services/scans';
import {
  closeSession,
  createSession,
  fetchSessionById,
  fetchSessionId,
  fetchSessions,
  updateSession,
} from 'services/scanSessions';
import { constants } from 'utils/constants';
import { emptyPositionsArr, incorrectPositionsArr } from 'utils/tubesRules';
import actions from './actions';
import {
  getEmptyPositions,
  getIncorrectPositions,
  getSelectedCode,
} from './selectors';

moment.tz.setDefault('America/New_York');

const formatResponseScanTubes = (response) => {
  const colsNumber = 8;
  return response
    ?.map?.((_, idx) => {
      if (idx % colsNumber === 0) {
        const rightIdx = idx + colsNumber;
        return Object.assign(
          {},
          ...response?.slice(idx, rightIdx)?.map?.((obj) => ({
            letter: obj?.position?.[0],
            [`col${obj?.position?.[1]}`]: {
              ...obj,
              status: obj?.status,
            },
          })),
        );
      }
    })
    ?.filter((item) => item?.letter);
};

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
  const { sessionId } = payload;
  try {
    const response = yield call(fetchSessionById, sessionId);

    const sortedScans = [...sortBy(response?.data?.scans, 'scan_order')];

    yield put({
      type: actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS,
      payload: {
        data: {
          ...response?.data,
          scans: sortedScans,
        },
      },
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_SCAN_SESSION_BY_ID_FAILURE,
    });

    notification.error({
      message: error.message,
    });
  }
}

export function* callUpdateSession({ payload }) {
  try {
    let response = null;

    if (payload.isSaveSession) {
      response = yield call(updateSession, payload);
    } else {
      response = yield call(closeSession);
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
    const response = yield call(fetchScanById, payload.scanId);

    const tubesInfo = response?.data?.scan_tubes;

    yield put({
      type: actions.FETCH_SCAN_BY_ID_SUCCESS,
      payload: {
        data: {
          ...response?.data,
          items: formatResponseScanTubes(tubesInfo),
        },
      },
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_SCAN_BY_ID_FAILURE,
    });

    notification.error({
      message: error.message,
    });
  }
}

export function* callUpdateTube({ payload }) {
  const { pooling } = constants.tubes;

  try {
    const response = yield call(updateTube, payload);

    const emptyPositions = yield select(getEmptyPositions);
    const empty_positions = yield call(
      emptyPositionsArr,
      emptyPositions,
      response.data,
    );

    const incorrectPositions = yield select(getIncorrectPositions);
    const incorrect_positions = yield call(
      incorrectPositionsArr,
      incorrectPositions,
      response.data,
    );

    const scanData = {
      empty_positions,
      incorrect_positions,
      last_modified_on: response.data.last_modified_on,
      last_modified_by: response.data.last_modified_by,
      ...(response?.data?.status === pooling.status
        ? { pool_id: response?.data?.tube_id }
        : {}),
    };

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
          scanData,
        },
      },
    });

    if (!payload.isRack) {
      yield put({
        type: actions.CHANGE_SESSION_DATA,
        payload: {
          data: {
            scanId: payload.scanId,
            scanData,
          },
        },
      });
    }

    notification.success({
      message: 'Tube updated',
    });
  } catch (error) {
    yield put({
      type: actions.UPDATE_TUBE_FAILURE,
      error: error,
    });

    notification.error({
      message: error.message ?? 'Something went wrong',
    });

    return error;
  }
}

export function* callInvalidateTube({ payload }) {
  try {
    const selectedCode = yield select(getSelectedCode);
    const response = yield call(updateTube, {
      ...payload,
      data: { status: selectedCode.status },
    });

    const scanData = {
      last_modified_on: response.data.last_modified_on,
      last_modified_by: response.data.last_modified_by,
    };

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
          tube: response.data,
          scanData,
        },
      },
    });

    yield put({
      type: actions.CHANGE_SESSION_DATA,
      payload: {
        data: {
          scanId: payload.scanId,
          scanData,
        },
      },
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Tube updated',
    });
  } catch (error) {
    yield put({
      type: actions.INVALIDATE_TUBE_FAILURE,
      error: error,
    });

    notification.error({
      message: error.message ?? 'Something went wrong',
    });

    throw Error(error);
  }
}

export function* callDeleteTube({ payload }) {
  try {
    const response = yield call(deleteTube, payload);

    const emptyPositions = yield select(getEmptyPositions);
    const empty_positions = yield call(
      emptyPositionsArr,
      emptyPositions,
      response.data,
    );

    const incorrectPositions = yield select(getIncorrectPositions);
    const incorrect_positions = yield call(
      incorrectPositionsArr,
      incorrectPositions,
      response.data,
    );

    const scanData = {
      empty_positions,
      incorrect_positions,
      last_modified_on: response.data.last_modified_on,
      last_modified_by: response.data.last_modified_by,
    };

    yield put({
      type: actions.DELETE_TUBE_SUCCESS,
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
          scanData,
        },
      },
    });

    if (!payload.isRack) {
      yield put({
        type: actions.CHANGE_SESSION_DATA,
        payload: {
          data: {
            scanId: payload.scanId,
            scanData,
          },
        },
      });
    }

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

export function* callFetchSessionId({ payload }) {
  try {
    const response = yield call(fetchSessionId);

    yield put({
      type: actions.FETCH_SESSION_ID_SUCCESS,
      payload: {
        sessionId: response?.data?.session_id,
      },
    });

    if (payload?.callback && !response?.data?.session_id) {
      yield call(payload.callback);
    }
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
    yield put({
      type: actions.CREATE_SESSION_FAILURE,
    });

    notification.error({
      message: 'Failure!',
      description: error.message,
    });

    return error;
  }
}

export function* callUpdateScan({ payload }) {
  try {
    const response = yield call(updateScan, payload);

    yield put({
      type: actions.UPDATE_SCAN_BY_ID_SUCCESS,
      payload: {
        data: {
          ...response.data,
          items: formatResponseScanTubes(response.data.scan_tubes),
        },
      },
    });

    yield put({
      type: actions.CHANGE_SESSION_DATA,
      payload: {
        data: {
          scanId: response.data.id,
          scanData: response.data,
        },
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
      type: actions.UPDATE_SCAN_BY_ID_FAILURE,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.error({
      message: error.message ?? 'Scan not updated',
    });
  }
}

export function* callCancelScan({ payload }) {
  try {
    const response = yield call(updateScan, payload);

    yield put({
      type: actions.CANCEL_SCAN_BY_ID_SUCCESS,
      payload: {
        data: response.data,
      },
    });

    yield put({
      type: actions.CHANGE_SESSION_DATA,
      payload: {
        data: {
          scanId: response.data.id,
          scanData: response.data,
        },
      },
    });

    notification.success({
      message: 'Scan updated',
    });
  } catch (error) {
    yield put({
      type: actions.CANCEL_SCAN_BY_ID_FAILURE,
    });

    notification.error({
      message: error.message ?? 'Scan not updated',
    });
  }
}

export function* callVoidScan({ payload }) {
  try {
    const response = yield call(deleteScan, payload);

    yield put({
      type: actions.VOID_SCAN_BY_ID_SUCCESS,
      payload: {
        data: { status: 'VOIDED' },
      },
    });

    yield put({
      type: actions.CHANGE_SESSION_DATA,
      payload: {
        data: {
          scanId: response.data.scan_id,
          scanData: {
            status: 'VOIDED',
          },
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

export function* callFetchCompanyInfo(payload) {
  try {
    yield call(callFetchCompanyShort, payload);

    const response = yield call(fetchIntakeReceiptLog, {
      created_after: moment()
        .subtract(24, 'hours')
        .format('YYYY-MM-DD'),
      created_before: moment().format('YYYY-MM-DD'),
      company_id: payload.payload.id,
    });

    yield put({
      type: actions.FETCH_COMPANY_INFO_SUCCESS,
      payload: {
        data: response.data.results,
      },
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_COMPANY_INFO_FAILURE,
    });
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
    takeEvery(actions.FETCH_COMPANY_INFO_REQUEST, callFetchCompanyInfo),
  ]);
}
