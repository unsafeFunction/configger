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

const racksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_RACKS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        search: action.payload?.search,
      };
    }
    case actions.FETCH_RACKS_SUCCESS: {
      const scanSessionForRender = action.payload.data.map((session) => {
        return {
          ...session,
          action: null,
        };
      });

      const { poolRacks } = constants;
      const { total, firstPage } = action.payload;

      return {
        ...state,
        items: firstPage
          ? scanSessionForRender
          : [...state.items, ...scanSessionForRender],
        total,
        isLoading: false,
        offset: firstPage
          ? poolRacks.itemsLoadingCount
          : state.offset + poolRacks.itemsLoadingCount,
      };
    }
    case actions.FETCH_RACKS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case actions.DELETE_RACK_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.DELETE_RACK_BY_ID_SUCCESS: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        isLoading: false,
      };
    }
    case actions.DELETE_RACK_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};

const initialSingleRackState = {
  items: [],
  tubes: [],
  isLoading: false,
  error: null,
};

const singleRackReducer = (state = initialSingleRackState, action) => {
  switch (action.type) {
    case actions.GET_RACK_REQUEST: {
      return {
        ...initialSingleRackState,
        isLoading: true,
      };
    }
    case actions.GET_RACK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
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
    case actions.UPDATE_RACK_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_RACK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_RACK_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_TUBE_SUCCESS: {
      const { row, tube } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        items: state.items.map((item) => {
          if (item.letter === row.letter) {
            return {
              ...item,
              ...row,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
            };
          }
          return item;
        }),
      };
    }
    case actions.DELETE_TUBE_SUCCESS: {
      const { row, tube } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        items: state.items.map((item) => {
          if (item.letter === row.letter) {
            return {
              ...item,
              ...row,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
            };
          }
          return item;
        }),
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
  singleRack: singleRackReducer,
});
