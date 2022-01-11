import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
};

export default function runsReducer(state = initialState, action) {
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

    case actions.PUBLISH_RUN_REQUEST: {
      return {
        ...state,
        items: state.items.map((run) => {
          if (run.id === action.payload.runId) {
            return {
              ...run,
              isUpdating: true,
            };
          }
          return run;
        }),
      };
    }
    case actions.PUBLISH_RUN_SUCCESS: {
      return {
        ...state,
        items: state.items.map((run) => {
          if (run.id === action.payload.data.id) {
            return {
              ...run,
              ...action.payload.data,
              isUpdating: false,
            };
          }
          return run;
        }),
      };
    }
    case actions.PUBLISH_RUN_FAILURE: {
      return {
        ...state,
        items: state.items.map((run) => {
          if (run.id === action?.payload?.runId) {
            return {
              ...run,
              isUpdating: false,
            };
          }
          return run;
        }),
      };
    }
    default:
      return state;
  }
}
