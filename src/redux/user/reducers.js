import actions from './actions';

const initialState = {
  profile: {},
  items: [],
  companies: [],
  total: 0,
  companiesCount: 0,
  authorized: false,
  isLoggingIn: false,
  isRestoring: false,
  isAccepting: false,
  isInviting: false,
  isProfileUpdating: false,
  isPasswordChanging: false,
  areUsersLoading: false,
  areCompaniesLoading: false,
  reinvitingUser: null,
  error: null,
  role: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return { ...state, isLoggingIn: true };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        authorized: true,
      };
    case actions.LOGIN_FAILURE:
      return { ...state, isLoggingIn: false, error: action.payload.data };
    case actions.FORGOT_REQUEST:
      return { ...state, isRestoring: true };
    case actions.FORGOT_SUCCESS:
      return { ...state, isRestoring: false };
    case actions.FORGOT_FAILURE:
      return { ...state, isRestoring: false, error: action.payload.data };
    case actions.RESTORE_REQUEST:
      return { ...state, isRestoring: true };
    case actions.RESTORE_SUCCESS:
      return { ...state, isRestoring: false };
    case actions.RESTORE_FAILURE:
      return { ...state, isRestoring: false, error: action.payload.data };
    case actions.LOGOUT:
      return { ...state, authorized: false };
    case actions.ACCEPT_REQUEST:
      return { ...state, isAccepting: true };
    case actions.ACCEPT_SUCCESS:
      return { ...state, isAccepting: false };
    case actions.ACCEPT_FAILURE:
      return { ...state, isAccepting: false, error: action.payload.data };
    case actions.PROFILE_SUCCESS:
      return { ...state, profile: action.payload.profile, role: action.payload.profile.role };
    case actions.PROFILE_FAILURE:
      return { ...state, error: action.payload.data };
    case actions.UPDATE_PROFILE_REQUEST:
      return { ...state, isProfileUpdating: true };
    case actions.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isProfileUpdating: false,
        profile: {
          ...state.profile,
          ...action.payload.data,
        },
      };
    case actions.UPDATE_PROFILE_FAILURE:
      return { ...state, isProfileUpdating: false, error: action.payload.data };
    case actions.CHANGE_PASSWORD_REQUEST:
      return { ...state, isPasswordChanging: true };
    case actions.CHANGE_PASSWORD_SUCCESS:
      return { ...state, isPasswordChanging: false };
    case actions.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isPasswordChanging: false,
        error: action.payload.data,
      };
    case actions.LOAD_USERS_REQUEST:
      return {
        ...state,
        areUsersLoading: true,
      };
    case actions.LOAD_USERS_SUCCESS:
      const newItems = action.payload.data.results.map(user => {
        return {
          ...user,
          key: user.id,
        };
      });
      const items =
        action.payload.page > 1 ? [...state.items, ...newItems] : newItems;
      return {
        ...state,
        items,
        total: action.payload.data.count,
        areUsersLoading: false,
      };
    case actions.LOAD_USERS_FAILURE:
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
    case actions.LOAD_COMPANIES_REQUEST:
      return {
        ...state,
        areCompaniesLoading: true,
      };
    case actions.LOAD_COMPANIES_SUCCESS:
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
    case actions.LOAD_COMPANIES_FAILURE:
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
