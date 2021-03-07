import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  offset: 0,
  total: 0,
  page: 1,
  search: '',
};

const managementReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case actions.CREATE_COMPANY_REQUEST:
      return {
        ...state,
        isLoading: false,
      };
    case actions.CREATE_COMPANY_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        isLoading: true,
      };
    case actions.CREATE_COMPANY_FAILURE: {
      return {
        ...state,
        isLoading: true,
        error: action.payload.data,
      };
    }
    default:
      return state;
  }
};

const initialSingleCompany = {
  unique_id: '',
  results_contacts: [],
  name: '',
};

export default combineReducers({
  all: managementReducer,
  singleCompany: single({
    types: [
      actions.GET_COMPANY_REQUEST,
      actions.GET_COMPANY_SUCCESS,
      actions.GET_COMPANY_FAILURE,
    ],
  })((state = initialSingleCompany, action = {}) => {
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
      case actions.ON_COMPANY_DATA_CHANGE:
        return Object.assign({}, state, {
          [action.payload.name]: action.payload.value,
        });
      case actions.ADD_SMILE_TO_SMS_BODY:
        return Object.assign({}, state, {
          smsBody: `${state.smsBody}${action.payload}`,
        });
      case actions.UPDATE_USERS_REQUEST: {
        return {
          ...state,
          isLoading: false,
        };
      }
      case actions.UPDATE_USERS_SUCCESS:
        return {
          ...state,
          results_contacts: action.payload.data.results_contacts,
          isLoading: true,
        };
      case actions.UPDATE_USERS_FAILURE: {
        return {
          ...state,
          isLoading: true,
          error: action.payload.data,
        };
      }
      default: {
        return state;
      }
    }
  }),
});
