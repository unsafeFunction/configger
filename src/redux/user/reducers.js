import actions from './actions'

const initialState = {
  id: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  authorized: false,
  isLoading: false,
  error: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return { ...state, isLoading: true }
    case actions.LOGIN_SUCCESS:
      return { ...state, isLoading: false, authorized: false }
    case actions.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload.data }
    default:
      return state
  }
}
