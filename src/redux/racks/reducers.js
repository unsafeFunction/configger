import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
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

const rack = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_RACK_REQUEST: {
      return {
        ...state,
        isLoading: true,
        search: action.payload.search,
      };
    }
    case actions.GET_RACK_SUCCESS: {
      return {
        isLoading: true,
        ...action.payload,
      };
    }
    case actions.GET_RACK_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case actions.RACK_DATA_CHANGE: {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  racks: racksReducer,
  singleRack: rack,
});
