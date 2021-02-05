import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import actions from './actions';
import { fetchPoolScanById, updateTube } from 'services/scans';

export function* callFetchScanSessions() {
  try {
    yield put({
      type: actions.FETCH_SCAN_SESSIONS_SUCCESS,
      payload: {
        data: [],
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

export function* callFetchPoolScanById({ payload }) {
  try {
    const response = yield call(fetchPoolScanById, payload);

    const tubesInfo = response?.data?.pool_scan_tubes;

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
      type: actions.FETCH_POOL_SCAN_BY_ID_SUCCESS,
      payload: {
        rack_id: response?.data?.rack_id,
        pool_id: response?.data?.pool_id,
        company_id: response?.data?.company_id,
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
          letter: response?.position?.[0],
          [`col${response?.position?.[1]}`]: {
            ...response,
            status: response?.status.toLowerCase(),
          },
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_SCAN_SESSIONS_REQUEST, callFetchScanSessions),
    takeEvery(actions.FETCH_POOL_SCAN_BY_ID_REQUEST, callFetchPoolScanById),
    takeEvery(actions.UPDATE_TUBE_REQUEST, callUpdateTube),
  ]);
}
