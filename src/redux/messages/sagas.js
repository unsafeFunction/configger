import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import { loadMessages, loadConversationMessages } from 'services/messages';
import { notification } from 'antd';
import { getMessages } from './selectors';
import actions from './actions';

export function* callLoadMessages({ payload }) {
  try {
    const response = yield call(loadMessages, payload);
    const conversationMessages = yield call(loadConversationMessages, {
      id: response.data[0].id,
    });

    yield put({
      type: actions.LOAD_MESSAGES_SUCCESS,
      payload: {
        data: response.data,
        total: response.headers['x-total-count'],
      },
    });

    yield put({
      type: actions.LOAD_CONVERSATION_MESSAGES_SUCCESS,
      payload: {
        data: conversationMessages.data,
        id: payload.id,
        conversation: response.data[0],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callLoadConversationMessages({ payload }) {
  try {
    const response = yield call(loadConversationMessages, payload);
    const conversations = yield select(getMessages);
    const singleConversation = conversations.items.find(conversation => {
      return conversation.id === payload.id;
    });

    yield put({
      type: actions.LOAD_CONVERSATION_MESSAGES_SUCCESS,
      payload: {
        data: response.data,
        conversationId: payload.id,
        conversation: singleConversation,
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
