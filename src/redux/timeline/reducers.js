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
    case actions.LOAD_TIMELINE_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.LOAD_TIMELINE_SUCCESS: {
      const { data } = action.payload;

      return {
        items: data,
        isLoading: true,
      };
    }
    case actions.LOAD_TIMELINE_FAILURE:
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
      case 'modal/HIDE_MODAL': {
        return {
          ...initialState,
        };
      }
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
      case actions.ADD_SMILE_TO_SMS_BODY:
        return Object.assign({}, state, {
          smsBody: `${state.smsBody}${action.payload}`,
        });
      default: {
        return state;
      }
    }
  }),
});
