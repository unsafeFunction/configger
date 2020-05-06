import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  total: 0,
  page: 1,
};

const campaignsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_CAMPAIGN_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.LOAD_CAMPAIGN_SUCCESS: {
      return {
        items: action.payload.data.map(campaign => {
          return {
            ...campaign,
            action: null,
          };
        }),
        total: action.payload.total,
        isLoading: true,
      };
    }
    case actions.REMOVE_CAMPAIGN_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.REMOVE_CAMPAIGN_SUCCESS: {
      return {
        items:
          action.payload.status === 204 &&
          state.items.filter(campaign => {
            return campaign.id !== action.payload.id;
          }),
        isLoading: true,
      };
    }
    case actions.CREATE_CAMPAIGN_REQUEST:
      return {
        ...state,
        isLoading: false,
      };
    case actions.CREATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        isLoading: true,
      };
    case actions.CREATE_CAMPAIGN_FAILURE: {
      return {
        isLoading: true,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

const initialSingleCampaign = {
  title: '',
  key: '',
  smsBody: '',
  destination: '',
  fromNumber: '+17739662558',
  originalLink: 'https://oa-sms-offers-dev.herokuapp.com',
  deepLinkDomain: 'https://oa-sms-offers-dev.herokuapp.com/o',
  trackingEnabled: false,
  conversationEnabled: false,
  startDateTime: '',
  error: null,
  isLoading: false,
  statistics: {},
};

export default combineReducers({
  all: campaignsReducer,
  singleCampaign: single({
    types: [
      actions.GET_CAMPAIGN_REQUEST,
      actions.GET_CAMPAIGN_SUCCESS,
      actions.GET_CAMPAIGN_FAILURE,
    ],
  })((state = initialSingleCampaign, action = {}) => {
    switch (action.type) {
      // case 'modal/HIDE_MODAL': {
      //   return {
      //     ...initialState,
      //   };
      // }
      case actions.START_CAMPAIGN_REQUEST:
        return {
          ...state,
          isLoading: false,
        };
      case actions.START_CAMPAIGN_SUCCESS:
        return {
          ...state,
          isLoading: true,
          status: action.payload.data.status,
        };
      case actions.START_CAMPAIGN_FAILURE:
        return {
          ...state,
          isLoading: true,
        };
      case actions.GET_CAMPAIGN_STATISTICS_REQUEST:
        return {
          ...state,
          isLoading: false,
        };
      case actions.GET_CAMPAIGN_STATISTICS_SUCCESS:
        return {
          ...state,
          isLoading: true,
          statistics: action.payload,
        };
      case actions.GET_CAMPAIGN_STATISTICS_FAILURE:
        return {
          ...state,
          isLoading: true,
        };
      case actions.ON_CAMPAIGN_DATA_CHANGE:
        return Object.assign({}, state, {
          [action.payload.name]: action.payload.value,
        });
      default: {
        return state;
      }
    }
  }),
});
