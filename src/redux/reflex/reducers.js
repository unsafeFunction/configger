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

const reflexReducer = (state = initialState, action) => {
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

    case actions.UPDATE_REFLEX_SAMPLE_REQUEST: {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === id) {
            return {
              ...sample,
              isUpdating: true,
            };
          }
          return sample;
        }),
      };
    }
    case actions.UPDATE_REFLEX_SAMPLE_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === data.sample_id) {
            return {
              ...sample,
              ...data,
              isUpdating: false,
            };
          }
          return sample;
        }),
      };
    }
    case actions.UPDATE_REFLEX_SAMPLE_FAILURE: {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === id) {
            return {
              ...sample,
              isUpdating: false,
            };
          }
          return sample;
        }),
      };
    }

    case actions.DELETE_REFLEX_ITEM_REQUEST: {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              isUpdating: true,
            };
          }
          return item;
        }),
      };
    }
    case actions.DELETE_REFLEX_ITEM_SUCCESS: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case actions.DELETE_REFLEX_ITEM_FAILURE: {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              isUpdating: false,
            };
          }
          return item;
        }),
      };
    }

    default:
      return state;
  }
};

const initialSingleState = {
  items: [],
  isLoading: false,
  pool_size: 0,
  rejected_count: 0,
  run_method: 'all',
};

const singleReflexReducer = (state = initialSingleState, action) => {
  switch (action.type) {
    case actions.FETCH_REFLEX_COMPARISON_REQUEST: {
      return {
        ...initialSingleState,
        isLoading: true,
      };
    }
    case actions.FETCH_REFLEX_COMPARISON_SUCCESS: {
      const { results, ...poolInfo } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        items: results,
        ...poolInfo,
      };
    }
    case actions.FETCH_REFLEX_COMPARISON_FAILURE: {
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
  all: reflexReducer,
  singleReflex: singleReflexReducer,
});
