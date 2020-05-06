import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
};

const recipientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_RECIPIENTS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.LOAD_RECIPIENTS_SUCCESS:
      return {
        ...state,
        items: action.payload.data.map(recipient => {
          return {
            ...recipient,
            actions: null,
          };
        }),
        isLoading: false,
      };
    case actions.LOAD_RECIPIENTS_FAILURE:
      return {
        ...state,
        isLoading: true,
      };
    case actions.PUT_RECIPIENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.PUT_RECIPIENT_SUCCESS: {
      return {
        ...state,
        // items: state.items.find((recipient, index, array) => {
        //   if (recipient.id === action.payload.id) {
        //     state.items[index] = action.payload;
        //     console.log(array);
        //     return array;
        //   }
        // }),
        items: state.items.map(recipient => {
          if (recipient.id === action.payload.id) {
            return action.payload;
          }
          return recipient;
        }),
        isLoading: false,
      };
    }
    case actions.PUT_RECIPIENT_FAILURE:
      return {
        ...state,
        isLoading: true,
      };
    case actions.CREATE_RECIPIENT_SUCCESS:
      return Object.assign({}, state, {
        items: [...state.items, action.payload.data],
        isLoading: false,
      });
    case actions.CREATE_RECIPIENT_FAILURE: {
      return {
        isLoading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

const initialSingleCampaign = {
  username: '',
  deliveryTime: '',
  toNumber: '',
  smsBody: '',
  clickedAt: '',
  shortId: '',
  deliveredAt: '',
  customer: {},
  campaign: {},
  deliveryStatus: '',
  error: null,
};

export default combineReducers({
  all: recipientsReducer,
  singleRecipient: single({
    types: [
      actions.GET_RECIPIENT_REQUEST,
      actions.GET_RECIPIENT_SUCCESS,
      actions.GET_RECIPIENT_FAILURE,
    ],
  })((state = initialSingleCampaign, action = {}) => {
    switch (action.type) {
      case actions.ON_RECIPIENT_DATA_CHANGE:
        return Object.assign({}, state, {
          [action.payload.name]: action.payload.value,
        });

      default: {
        return state;
      }
    }
  }),
});
