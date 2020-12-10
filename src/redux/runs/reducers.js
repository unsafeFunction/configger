import actions from './actions';
import { constants } from 'utils/constants';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  search: '',
  error: null,
  // page: 1,
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
          ? action.payload.data.results.map(run => {
              return {
                ...run,
              };
            })
          : [
              ...state.items,
              ...action.payload.data.results.map(run => {
                return {
                  ...run,
                };
              }),
            ],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants.runs.itemsLoadingCount
          : state.offset + constants.runs.itemsLoadingCount,
      };
    }
    case actions.FETCH_RUNS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    case actions.PUBLISH_RUN_REQUEST: {
      // console.log('PUBLISH_RUN_REQUEST action', action);
      return {
        ...state,
        items: state.items.map(run => {
          if (run.unique_id === action.payload.runId) {
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
        items: state.items.map(run => {
          if (run.unique_id === action.payload.data.unique_id) {
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
        items: state.items.map(run => {
          if (run.unique_id === action.payload.runId) {
            return {
              ...run,
              isUpdating: false,
            };
          }
          return run;
        }),
        // error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
