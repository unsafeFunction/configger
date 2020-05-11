import { all, takeEvery, put, call } from 'redux-saga/effects';
import { loadMessages, loadConversationMessages } from 'services/messages';
import { notification } from 'antd';
import actions from './actions';

export function* callLoadMessages({ payload }) {
  try {
    const response = yield call(loadMessages, payload);

    yield put({
      type: actions.LOAD_MESSAGES_SUCCESS,
      payload: {
        data: response.data,
        total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callLoadConversationMessages({ payload }) {
  try {
    const response = yield call(loadConversationMessages, payload);
    console.log(response);
    yield put({
      type: actions.LOAD_CONVERSATION_MESSAGES_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_MESSAGES_REQUEST, callLoadMessages),
    takeEvery(
      actions.LOAD_CONVERSATION_MESSAGES_REQUEST,
      callLoadConversationMessages,
    ),
  ]);
}
