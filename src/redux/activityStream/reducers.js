import actions from './actions';
import { constants } from 'utils/constants';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
};

export default function activityStreamReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ACTIVITY_BY_USER_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case actions.FETCH_ACTIVITY_BY_USER_ID_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.activityStream?.itemsLoadingCount
          : state.offset + constants?.activityStream?.itemsLoadingCount,
      };
    }
    case actions.FETCH_ACTIVITY_BY_USER_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}
