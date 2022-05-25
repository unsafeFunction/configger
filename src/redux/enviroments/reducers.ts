import { AnyAction, combineReducers } from 'redux';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
};

const scannersReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case actions.FETCH_ENVIROMENT_REQUEST: {
      return {
        ...state,
        ...initialState,
        isLoading: true,
      };
    }
    case actions.FETCH_ENVIROMENT_SUCCESS: {
      return {
        ...state,
        items: action.payload.data,
        isLoading: false,
      };
    }
    case actions.FETCH_ENVIROMENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // case actions.CREATE_ENVIROMENT_REQUEST: {
    //   return {
    //     ...state,
    //     ...initialState,
    //     isLoading: true,
    //   };
    // }
    // case actions.CREATE_ENVIROMENT_SUCCESS: {
    //   return {
    //     ...state,
    //     items: action.payload.data,
    //     isLoading: false,
    //   };
    // }
    // case actions.CREATE_ENVIROMENT_FAILURE: {
    //   return {
    //     ...state,
    //     isLoading: false,
    //   };
    // }
    default:
      return state;
  }
};

export default combineReducers({
  all: scannersReducer,
});
