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
        items: action.payload.data.map(conversation => {
          return {
            ...conversation,
            messages: [],
          };
        }),
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
        items: state.items.map((conversation, index, array) => {
          if (conversation.id === action.payload.conversationId) {
            return {
              ...conversation,
              messages: action.payload.data,
            };
          }
          return conversation;
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
  isLoading: false,
  messages: [],
  customer: {},
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
      case actions.SET_MESSAGE_DATA: {
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      }
      case actions.LOAD_CONVERSATION_MESSAGES_REQUEST:
        return {
          ...state,
          isLoading: true,
        };
      case actions.LOAD_CONVERSATION_MESSAGES_SUCCESS:
        return {
          ...state,
          ...action.payload.conversation,
          messages: action.payload.data,
          isLoading: false,
        };
      case actions.LOAD_CONVERSATION_MESSAGES_FAILURE:
        return {
          ...state,
          isLoading: true,
        };
      default: {
        return state;
      }
    }
  }),
});
