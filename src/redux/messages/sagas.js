import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  loadMessages,
  loadConversationMessages,
  sendMessage,
} from 'services/messages';
import { notification } from 'antd';
import { getMessages, getSingleConversation } from './selectors';
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

export function* callSendMessage() {
  try {
    const { id, body, twilioNumber, customer } = yield select(
      getSingleConversation,
    );
    console.log(id, body, twilioNumber, customer);
    const response = yield call(sendMessage, {
      conversationId: id,
      body,
      fromNumber: twilioNumber,
      toNumber: customer.toNumber,
    });

    yield put({
      type: actions.SEND_MESSAGE_SUCCESS,
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
    takeEvery(actions.SEND_MESSAGE_REQUEST, callSendMessage),
    takeEvery(
      actions.LOAD_CONVERSATION_MESSAGES_REQUEST,
      callLoadConversationMessages,
    ),
  ]);
}
