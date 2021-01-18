import actions from './actions';

const initialState = {
  items: [],
  current: 0,
  isLoading: false,
  total: 0,
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INFO_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_INFO_SUCCESS: {
      return {
        ...state,
        items: action.payload?.data?.items ?? [],
        current: action.payload?.data?.current ?? 0,
        isLoading: false,
      };
    }
    case actions.FETCH_INFO_FAILURE: {
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
