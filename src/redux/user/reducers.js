import actions from './actions';

const initialState = {
  profile: {},
  authorized: false,
  isLoggingIn: false,
  isRestoring: false,
  isAccepting: false,
  isProfileUpdating: false,
  isPasswordChanging: false,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return { ...state, isLoggingIn: true };
    case actions.LOGIN_SUCCESS:
      return { ...state, isLoggingIn: false, authorized: true };
    case actions.LOGIN_FAILURE:
      return { ...state, isLoggingIn: false, error: action.payload.data };
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
      return { ...state, profile: action.payload.profile };
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
    case actions.LOAD_USERS_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.LOAD_USERS_SUCCESS: {
      console.log(action.payload);
      return {
        items: action.payload.data.map(user => {
          return {
            ...user,
            action: null,
          };
        }),
        // total: action.payload.total,
        isLoading: true,
      };
    }
    case actions.LOAD_USERS_FAILURE:
      return { ...state, isLoading: true, error: action.payload.data };
    default:
      return state;
  }
}
