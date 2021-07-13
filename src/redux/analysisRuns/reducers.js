import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import actions from './actions';

const initialRunsState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  search: '',
  error: null,
};

const runsReducer = (state = initialRunsState, action) => {
  switch (action.type) {
    case actions.FETCH_RUNS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_RUNS_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.runs?.itemsLoadingCount
          : state.offset + constants?.runs?.itemsLoadingCount,
      };
    }
    case actions.FETCH_RUNS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPLOAD_RUN_RESULT_SUCCESS: {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        }),
      };
    }

    default:
      return state;
  }
};

const initialRunState = {
  items: [],
  id: null,
  isLoading: false,
};

const singleRunReducer = (state = initialRunState, action) => {
  switch (action.type) {
    case actions.FETCH_RUN_REQUEST: {
      return {
        ...state,
        items: [],
        isLoading: true,
      };
    }
    case actions.FETCH_RUN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
      };
    }
    case actions.FETCH_RUN_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_POOL_REQUEST: {
      return {
        ...state,
        items: state.items.map((pool) => {
          if (pool.id === action.payload.id) {
            return {
              ...pool,
              isUpdating: true,
            };
          }
          return pool;
        }),
      };
    }
    case actions.UPDATE_POOL_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        items: state.items.map((pool) => {
          if (pool.id === data.id) {
            return {
              ...pool,
              ...data,
              isUpdating: false,
            };
          }
          return pool;
        }),
      };
    }
    case actions.UPDATE_POOL_FAILURE: {
      const { poolId } = action.payload;
      return {
        ...state,
        items: state.items.map((pool) => {
          if (pool.id === poolId) {
            return {
              ...pool,
              isUpdating: false,
            };
          }
          return pool;
        }),
      };
    }

    default:
      return state;
  }
};

export default combineReducers({
  all: runsReducer,
  singleRun: singleRunReducer,
});
