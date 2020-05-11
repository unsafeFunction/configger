import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
};

const conversations = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        items: action.payload.data,
        isLoading: false,
      };
    case actions.LOAD_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: true,
      };
    case actions.LOAD_CONVERSATION_MESSAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.LOAD_CONVERSATION_MESSAGES_SUCCESS:
      return {
        ...state,
        items: state.items.map(conversation => {
          console.log(action.payload);

          //   const conversationMessages = action.payload.data.find(messages => {
          //     return messages.conversationId === conversation.id;
          //   });
          //   if (conversationMessages) {
          //     return {
          //       ...conversation,
          //       messages: conversationMessages,
          //     };
          //   }
          //   return conversation;
        }),
        isLoading: false,
      };
    case actions.LOAD_CONVERSATION_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

const initialSingleCampaign = {
  error: null,
};

export default combineReducers({
  all: conversations,
  singleConversation: single({
    types: [
      actions.GET_RECIPIENT_REQUEST,
      actions.GET_RECIPIENT_SUCCESS,
      actions.GET_RECIPIENT_FAILURE,
    ],
  })((state = initialSingleCampaign, action = {}) => {
    switch (action.type) {
      default: {
        return state;
      }
    }
  }),
});
