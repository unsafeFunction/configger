import { createSelector } from 'reselect';

const messages = state => {
  return state.messages.all;
};

export const getMessages = createSelector(messages, messagesArray => {
  return messagesArray;
});
