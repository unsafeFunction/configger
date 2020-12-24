import actions from './actions';

const initialState = {
  isActive: false,
  isLoading: false,
  path: '',
  accessToken: '',
  termsAccepted: false,
  role: '',
  error: null,
};

export default function runsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CREDENTIALS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_CREDENTIALS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isActive: true,
        ...action.payload,
      };
    }
    case actions.FETCH_CREDENTIALS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
