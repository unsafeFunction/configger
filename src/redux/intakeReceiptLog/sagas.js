import { all, takeEvery, put, call } from 'redux-saga/effects';
import { fetchIntakeReceiptLog, createIntake } from 'services/intakeReceiptLog';
import { notification } from 'antd';
import actions from './actions';
import modalActions from 'redux/modal/actions';

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

    notification.success({
      message: 'Intake added',
    });

    return yield call(resetForm);
  } catch (error) {
    const errorData = error.response?.data?.field_errors;
    yield put({
      type: actions.CREATE_INTAKE_FAILURE,
      payload: {
        data: errorData,
      },
    });
    notification.error({
      message: 'Failure!',
      description: `Intake not added`,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_INTAKE_LOG_REQUEST, callFetchIntakeReceiptLog),
    takeEvery(actions.CREATE_INTAKE_REQUEST, callCreateIntake),
  ]);
}
