import actions from './actions';

const initialState = {
  items: [],
  total: 0,
  error: null,
  url: '',
};

export default function intakeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_COMPANIES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_COMPANIES_SUCCESS: {
      return {
        ...state,
        items: action.payload.data,
        total: action.payload.total,
        isLoading: false,
      }
    }
    case actions.FETCH_COMPANIES_FAILURE: {
        return {
          ...state,
          isLoading: false,
          error: action.payload.data,
        };
    }
    case actions.CREATE_PACKING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_PACKING_SUCCESS: {
      return {
        ...state,
        url: action.payload.data,
        isLoading: false,
      }
    }
    case actions.CREATE_PACKING_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
