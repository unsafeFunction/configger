import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  loadRecipients,
  updateRecipient,
  getSingleRecipient,
  createRecipient,
} from 'services/recipients';
import { notification } from 'antd';
import { getRecipient } from './selectors';
import actions from './actions';

export function* callLoadRecipients({ payload }) {
  try {
    const response = yield call(loadRecipients, payload);

    yield put({
      type: actions.LOAD_RECIPIENTS_SUCCESS,
      payload: {
        data: response.data,
        total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callGetRecipient({ payload }) {
  try {
    const response = yield call(getSingleRecipient, payload.id);

    yield put({
      type: actions.GET_RECIPIENT_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callCreateRecipient({ payload }) {
  try {
    const data = yield select(getRecipient);

    const response = yield call(createRecipient, {
      ...data,
      campaignId: payload.campaignId,
    });

    yield put({
      type: actions.CREATE_RECIPIENT_SUCCESS,
      payload: {
        data: response.data,
      },
    });
    notification.success({
      message: 'Successfully create campaign',
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callUpdateRecipient() {
  try {
    const data = yield select(getRecipient);

    const response = yield call(updateRecipient, {
      ...data,
      id: data.id,
    });

    yield put({
      type: actions.PUT_RECIPIENT_SUCCESS,
      payload: {
        ...response.data,
      },
    });
    notification.success({
      message: 'Successfully update campaign',
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_RECIPIENTS_REQUEST, callLoadRecipients),
    takeEvery(actions.PUT_RECIPIENT_REQUEST, callUpdateRecipient),
    takeEvery(actions.CREATE_RECIPIENT_REQUEST, callCreateRecipient),
    takeEvery(actions.GET_RECIPIENT_REQUEST, callGetRecipient),
  ]);
}
