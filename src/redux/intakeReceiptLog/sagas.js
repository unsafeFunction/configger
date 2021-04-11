import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import modalActions from 'redux/modal/actions';
import {
  createIntake,
  fetchIntakeReceiptLog,
  updateIntake,
} from 'services/intakeReceiptLog';
import actions from './actions';

export function* callFetchIntakeReceiptLog({ payload }) {
  try {
    const response = yield call(fetchIntakeReceiptLog, payload);

    yield put({
      type: actions.FETCH_INTAKE_LOG_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callCreateIntake({ payload }) {
  const { intake, resetForm } = payload;

  try {
    const response = yield call(createIntake, intake);

    yield put({
      type: actions.CREATE_INTAKE_SUCCESS,
      payload: response,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Intake added',
    });

    return yield call(resetForm);
  } catch (error) {
    yield put({
      type: actions.CREATE_INTAKE_FAILURE,
      payload: {
        data: error.message ?? null,
      },
    });

    notification.error({
      message: error.message ?? 'Intake not added',
    });
  }
}

export function* callUpdateIntake({ payload }) {
  const { intake, resetForm } = payload;

  try {
    const response = yield call(updateIntake, intake);

    yield put({
      type: actions.PATCH_INTAKE_SUCCESS,
      payload: response,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Intake updated',
    });

    return yield call(resetForm);
  } catch (error) {
    yield put({
      type: actions.PATCH_INTAKE_FAILURE,
      payload: {
        data: error.message ?? null,
      },
    });

    notification.error({
      message: error.message ?? 'Intake not updated',
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_INTAKE_LOG_REQUEST, callFetchIntakeReceiptLog),
    takeEvery(actions.CREATE_INTAKE_REQUEST, callCreateIntake),
    takeEvery(actions.PATCH_INTAKE_REQUEST, callUpdateIntake),
  ]);
}
