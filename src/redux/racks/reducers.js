import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import forEach from 'lodash.foreach';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const racksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_RACKS_REQUEST: {
      return {
        ...state,
        isLoading: false,
        search: action.payload.search,
      };
    }
    case actions.FETCH_RACKS_SUCCESS: {
      const scanSessionForRender = action.payload.data.map(session => {
        return {
          ...session,
          action: null,
        };
      });

      const { scanSessions } = constants;
      const { total, firstPage } = action.payload;

      return {
        ...state,
        items: firstPage
          ? scanSessionForRender
          : [...state.items, ...scanSessionForRender],
        total,
        isLoading: true,
        offset: firstPage
          ? scanSessions.itemsLoadingCount
          : state.offset + scanSessions.itemsLoadingCount,
      };
    }
    case actions.FETCH_RACKS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  racks: racksReducer,
});
