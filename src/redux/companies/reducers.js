import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import { constants } from 'utils/constants';
import isEmpty from 'lodash.isempty';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  offset: 0,
  total: 0,
  search: '',
};

const companiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_COMPANIES_REQUEST: {
      return {
        ...state,
        isLoading: false,
        search: action.payload.search,
      };
    }
    case actions.FETCH_COMPANIES_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.map((company) => {
              return {
                ...company,
                action: null,
              };
            })
          : [
              ...state.items,
              ...action.payload.data.map((company) => {
                return {
                  ...company,
                  action: null,
                };
              }),
            ],
        total: action.payload.total,
        isLoading: true,
        offset: action.payload.firstPage
          ? constants.companies.itemsLoadingCount
          : state.offset + constants.companies.itemsLoadingCount,
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
          state.items.filter((campaign) => {
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
  id: '',
  results_contacts: [],
  name: '',
  company_id: '',
  short_name: '',
  isLoadingCompany: false,
  error: null,
};

export default combineReducers({
  all: companiesReducer,
  singleCompany: single({
    types: [
      actions.GET_COMPANY_REQUEST,
      actions.GET_COMPANY_SUCCESS,
      actions.GET_COMPANY_FAILURE,
      actions.FETCH_COMPANY_SHORT_REQUEST,
      actions.FETCH_COMPANY_SHORT_SUCCESS,
      actions.FETCH_COMPANY_SHORT_FAILURE,
    ],
  })((state = initialSingleCompany, action = {}) => {
    switch (action.type) {
      case 'modal/SHOW_MODAL':
      case 'modal/HIDE_MODAL': {
        return {
          ...initialSingleCompany,
        };
      }
      case actions.FETCH_COMPANY_SHORT_REQUEST:
        return {
          ...state,
          isLoadingCompany: true,
          error: null,
        };
      case actions.FETCH_COMPANY_SHORT_SUCCESS:
        const company = !isEmpty(action.payload.data)
          ? action.payload.data
          : initialSingleCompany;
        return {
          ...state,
          isLoadingCompany: false,
          ...company,
        };
      case actions.FETCH_COMPANY_SHORT_FAILURE:
        return {
          ...state,
          ...initialSingleCompany,
          error: action.payload.data,
        };
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
