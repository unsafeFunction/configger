import actions from './actions';

const initialState = {
  id: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  authorized: false,
  isLoggingIn: false,
  isRestoring: false,
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
    default:
      return state;
  }
}
