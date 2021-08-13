import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
};

const reflexListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_REFLEX_LIST_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_REFLEX_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        offset: action.payload.firstPage
          ? constants?.reflexList?.itemsLoadingCount
          : state.offset + constants?.reflexList?.itemsLoadingCount,
      };
    }
    case actions.FETCH_REFLEX_LIST_FAILURE: {
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
  all: reflexListReducer,
});
