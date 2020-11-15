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
  isAccepting: false,
  isLoading: false,
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
    case actions.FETCH_USERS_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.FETCH_USERS_SUCCESS: {
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
    case actions.FETCH_USERS_FAILURE:
      return { ...state, isLoading: true, error: action.payload.data };
    default:
      return state;
  }
}
