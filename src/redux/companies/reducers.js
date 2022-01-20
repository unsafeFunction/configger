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
    default:
      return state;
  }
};

const initialSingleCompany = {
  id: '',
  results_contacts: [],
  name: '',
  company_id: '',
  name_short: '',
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
    ],
  })((state = initialSingleCompany, action = {}) => {
    switch (action.type) {
      case 'modal/SHOW_MODAL':
      case 'modal/HIDE_MODAL': {
        return {
          ...initialSingleCompany,
        };
      }
      case actions.ON_COMPANY_DATA_CHANGE:
        return Object.assign({}, state, {
          [action.payload.name]: action.payload.value,
        });
      default: {
        return state;
      }
    }
  }),
});
