import actions from './actions';

const initialState = {
  items: {},
  isLoading: false,
};

export default function intakeDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DAILY_INTAKE_COUNTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_DAILY_INTAKE_COUNTS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        items: action.payload.data.result,
      };
    }
    case actions.FETCH_DAILY_INTAKE_COUNTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
