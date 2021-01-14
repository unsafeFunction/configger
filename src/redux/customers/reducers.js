import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  companies: [],
  total: 0,
  offset: 0,
  companiesCount: 0,
  isInviting: false,
  areUsersLoading: false,
  areCompaniesLoading: false,
  reinvitingUser: null,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        areUsersLoading: true,
      };
    case actions.FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.total,
        areUsersLoading: false,
        offset: action.payload.firstPage
          ? constants?.customers?.itemsLoadingCount
          : state.offset + constants?.customers?.itemsLoadingCount,
      };
    case actions.FETCH_CUSTOMERS_FAILURE:
      return { ...state, areUsersLoading: false, error: action.payload.data };

    case actions.SET_STATUS_SUCCESS:
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.payload.data.id) {
            user.is_active = action.payload.data.is_active;
          }
          return user;
        }),
      };
    case actions.REINVITE_REQUEST:
      return { ...state, reinvitingUser: action.payload.id };
    case actions.REINVITE_SUCCESS:
      return { ...state, reinvitingUser: null };
    case actions.REINVITE_FAILURE:
      return { ...state, reinvitingUser: null, error: action.payload.data };
    case actions.FETCH_COMPANIES_REQUEST:
      return {
        ...state,
        areCompaniesLoading: true,
      };
    case actions.FETCH_COMPANIES_SUCCESS:
      const newCompanies = action.payload.data.results.map(company => {
        return {
          ...company,
          key: company.company_id,
          label: company.name,
          value: company.company_id,
        };
      });
      const companies =
        action.payload.page > 1
          ? [...state.companies, ...newCompanies]
          : newCompanies;
      return {
        ...state,
        companies,
        companiesCount: action.payload.data.count,
        areCompaniesLoading: false,
      };
    case actions.FETCH_COMPANIES_FAILURE:
      return {
        ...state,
        areCompaniesLoading: false,
        error: action.payload.data,
      };
    case actions.INVITE_CUSTOMER_REQUEST:
      return { ...state, isInviting: true };
    case actions.INVITE_CUSTOMER_SUCCESS:
      return { ...state, isInviting: false };
    case actions.INVITE_CUSTOMER_FAILURE:
      return { ...state, isInviting: false, error: action.payload.data };
    default:
      return state;
  }
}
