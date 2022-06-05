import { AnyAction, combineReducers } from 'redux';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
};

const scannersReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case actions.CREATE_PROJECT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_PROJECT_SUCCESS: {
      return {
        ...state,
        items: [...state.items, action.payload.data],
        isLoading: false,
      };
    }
    case actions.CREATE_PROJECT_FAILURE: {
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
