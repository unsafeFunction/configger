import { createSelector } from 'reselect';

const messages = state => {
  return state.messages.all;
};

const singleMessage = state => {
  return state.messages.singleConversation;
};

export const getMessages = createSelector(messages, messagesArray => {
  return messagesArray;
});

export const getSingleConversation = createSelector(
  singleMessage,
  singleMessageData => {
    return singleMessageData;
  },
);
