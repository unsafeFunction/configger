import { all, takeEvery, put, call } from 'redux-saga/effects';
import {
  fetchIntakeReceiptLog,
  createIntake,
  updateIntake,
} from 'services/intakeReceiptLog';
import { notification } from 'antd';
import modalActions from 'redux/modal/actions';
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
    const { detail, field_errors } = error.response?.data;

    let errorMsg = '';
    if (detail) {
      errorMsg = detail;
    } else if (field_errors) {
      errorMsg = JSON.stringify(field_errors, null, 2).replace(/{|}|"|,/g, '');
    } else {
      errorMsg = 'Intake not added';
    }

    yield put({
      type: actions.CREATE_INTAKE_FAILURE,
      payload: {
        data: errorMsg,
      },
    });

    notification.error({
      message: 'Failure!',
      description: errorMsg,
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
      message: 'Intake changed',
    });

    return yield call(resetForm);
  } catch (error) {
    const { detail, field_errors } = error.response?.data;

    let errorMsg = '';
    if (detail) {
      errorMsg = detail;
    } else if (field_errors) {
      errorMsg = JSON.stringify(field_errors, null, 2).replace(/{|}|"|,/g, '');
    } else {
      errorMsg = 'Intake not added';
    }

    yield put({
      type: actions.PATCH_INTAKE_FAILURE,
      payload: {
        data: errorMsg,
      },
    });

    notification.error({
      message: 'Failure!',
      description: errorMsg,
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
