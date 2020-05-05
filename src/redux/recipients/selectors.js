import { createSelector } from 'reselect';

const singleRecipient = state => {
  return state.recipients.singleRecipient;
};

export const getRecipient = createSelector(singleRecipient, recipient => {
  return recipient;
});
