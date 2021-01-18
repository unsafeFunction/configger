import actions from './actions';

const initialState = {
  items: [],
  total: 0,
  error: null,
};

export default function intakeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INTAKE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_INTAKE_SUCCESS: {
      return {
        ...state,
        items: action.payload.data,
        total: action.payload.total,
        isLoading: false,
      };
    }
    case actions.FETCH_INTAKE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
