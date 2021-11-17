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

    default:
      return state;
  }
};

const initialSingleState = {
  items: [],
  isLoading: false,
};

const singleReflexReducer = (state = initialSingleState, action) => {
  switch (action.type) {
    case actions.FETCH_REFLEX_DETAILS_REQUEST: {
      return {
        ...initialSingleState,
        isLoading: true,
      };
    }
    case actions.FETCH_REFLEX_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        items: action.payload.data,
      };
    }
    case actions.FETCH_REFLEX_DETAILS_FAILURE: {
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
