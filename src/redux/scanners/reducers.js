import { combineReducers } from 'redux';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
};

const scannersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_SCANNERS_REQUEST: {
      return {
        ...state,
        ...initialState,
        isLoading: true,
      };
    }
    case actions.FETCH_SCANNERS_SUCCESS: {
      return {
        ...state,
        items: action.payload.data,
        isLoading: false,
      };
    }
    case actions.FETCH_SCANNERS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  all: scannersReducer,
});
