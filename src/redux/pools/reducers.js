import actions from './actions';
import { constants } from 'utils/constants';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
  resultList: {
    items: [],
    isLoading: false,
    error: null,
  },
};

export default function poolsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_POOLS_BY_RUN_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_POOLS_BY_RUN_ID_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.pools?.itemsLoadingCount
          : state.offset + constants?.pools?.itemsLoadingCount,
      };
    }
    case actions.FETCH_POOLS_BY_RUN_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    case actions.FETCH_POOLS_BY_COMPANY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_POOLS_BY_COMPANY_ID_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.pools?.itemsLoadingCount
          : state.offset + constants?.pools?.itemsLoadingCount,
      };
    }
    case actions.FETCH_POOLS_BY_COMPANY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    case actions.FETCH_ALL_POOLS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_ALL_POOLS_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.pools?.itemsLoadingCount
          : state.offset + constants?.pools?.itemsLoadingCount,
      };
    }
    case actions.FETCH_ALL_POOLS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    case actions.PUBLISH_POOL_REQUEST: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action.payload.poolId) {
            return {
              ...pool,
              isUpdating: true,
            };
          }
          return pool;
        }),
      };
    }
    case actions.PUBLISH_POOL_SUCCESS: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action.payload.data.unique_id) {
            return {
              ...pool,
              ...action.payload.data,
              isUpdating: false,
            };
          }
          return pool;
        }),
      };
    }
    case actions.PUBLISH_POOL_FAILURE: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action?.payload?.poolId) {
            return {
              ...pool,
              isUpdating: false,
            };
          }
          return pool;
        }),
        // error: action.payload.data,
      };
    }

    case actions.FETCH_RESULT_LIST_REQUEST: {
      return {
        ...state,
        resultList: {
          ...state.resultList,
          items: [],
          isLoading: true,
          error: null,
        },
      };
    }
    case actions.FETCH_RESULT_LIST_SUCCESS: {
      return {
        ...state,
        resultList: {
          ...state.resultList,
          isLoading: false,
          items: action.payload.data,
        },
      };
    }
    case actions.FETCH_RESULT_LIST_FAILURE: {
      return {
        ...state,
        resultList: {
          ...state.resultList,
          isLoading: false,
          // error: action.payload.data,
        },
      };
    }

    case actions.UPDATE_POOL_RESULT_REQUEST: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action.payload.poolId) {
            return {
              ...pool,
              resultIsUpdating: true,
            };
          }
          return pool;
        }),
      };
    }
    case actions.UPDATE_POOL_RESULT_SUCCESS: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action.payload.data.unique_id) {
            return {
              ...pool,
              ...action.payload.data,
              resultIsUpdating: false,
            };
          }
          return pool;
        }),
      };
    }
    case actions.UPDATE_POOL_RESULT_FAILURE: {
      return {
        ...state,
        items: state.items.map(pool => {
          if (pool.unique_id === action?.payload?.poolId) {
            return {
              ...pool,
              resultIsUpdating: false,
            };
          }
          return pool;
        }),
        // error: action.payload.data,
      };
    }

    default:
      return state;
  }
}
