import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  filename: '',
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
};

const poolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_POOLS_BY_RUN_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_POOLS_BY_RUN_ID_SUCCESS: {
      const { data, firstPage, filename } = action.payload;
      return {
        ...state,
        items: firstPage ? data.pools : [...state.items, ...data.pools],
        total: data.pools_published + data.pools_unpublished,
        filename,
        isLoading: false,
        offset: firstPage
          ? constants.poolsByRun.itemsLoadingCount
          : state.offset + constants.poolsByRun.itemsLoadingCount,
      };
    }
    case actions.FETCH_POOLS_BY_RUN_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
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
      };
    }

    case actions.PUBLISH_POOL_REQUEST: {
      return {
        ...state,
        items: state.items.map((pool) => {
          if (pool.id === action.payload.poolId) {
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
        items: state.items.map((pool) => {
          if (pool.id === action.payload.data.id) {
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
        items: state.items.map((pool) => {
          if (pool.id === action?.payload?.poolId) {
            return {
              ...pool,
              isUpdating: false,
            };
          }
          return pool;
        }),
      };
    }

    case actions.UPDATE_POOL_RESULT_REQUEST: {
      return {
        ...state,
        items: state.items.map((pool) => {
          if (pool.id === action.payload.poolId) {
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
        items: state.items.map((pool) => {
          if (pool.id === action.payload.data.id) {
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
        items: state.items.map((pool) => {
          if (pool.id === action?.payload?.poolId) {
            return {
              ...pool,
              resultIsUpdating: false,
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

const poolsByDaysReducer = (state = initialState, action) => {
  switch (action.type) {
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
          ? constants?.poolsByCompany?.itemsLoadingCount
          : state.offset + constants?.poolsByCompany?.itemsLoadingCount,
      };
    }
    case actions.FETCH_POOLS_BY_COMPANY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_POOL_RESULT_BY_DAY_REQUEST: {
      const updatedPoolData = action.payload;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receiptDate) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.poolId) {
                  return {
                    ...poolItem,
                    resultIsUpdating: true,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }
    case actions.UPDATE_POOL_RESULT_BY_DAY_SUCCESS: {
      const updatedPoolData = action.payload.data;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receipt_date) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.id) {
                  return {
                    ...poolItem,
                    ...updatedPoolData,
                    resultIsUpdating: false,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }
    case actions.UPDATE_POOL_RESULT_BY_DAY_FAILURE: {
      const updatedPoolData = action.payload;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receiptDate) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.poolId) {
                  return {
                    ...poolItem,
                    resultIsUpdating: false,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }

    case actions.PUBLISH_POOL_BY_DAY_REQUEST: {
      const updatedPoolData = action.payload;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receiptDate) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.poolId) {
                  return {
                    ...poolItem,
                    isUpdating: true,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }
    case actions.PUBLISH_POOL_BY_DAY_SUCCESS: {
      const updatedPoolData = action.payload.data;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receipt_date) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.id) {
                  return {
                    ...poolItem,
                    ...updatedPoolData,
                    isUpdating: false,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }
    case actions.PUBLISH_POOL_BY_DAY_FAILURE: {
      const updatedPoolData = action.payload;

      return {
        ...state,
        items: state.items.map((dateItem) => {
          const poolDate = Object.keys(dateItem)[0];
          if (poolDate === updatedPoolData.receiptDate) {
            return {
              [poolDate]: dateItem[poolDate].map((poolItem) => {
                if (poolItem.id === updatedPoolData.poolId) {
                  return {
                    ...poolItem,
                    isUpdating: false,
                  };
                }
                return poolItem;
              }),
            };
          }
          return dateItem;
        }),
      };
    }

    default:
      return state;
  }
};

const initialResultListState = {
  items: [],
  isLoading: false,
};

const resultListReducer = (state = initialResultListState, action) => {
  switch (action.type) {
    case actions.FETCH_RESULT_LIST_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_RESULT_LIST_SUCCESS: {
      return {
        ...state,
        items: action.payload.data,
        isLoading: false,
      };
    }
    case actions.FETCH_RESULT_LIST_FAILURE: {
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
  all: poolsReducer,
  allByDays: poolsByDaysReducer,
  resultList: resultListReducer,
});
