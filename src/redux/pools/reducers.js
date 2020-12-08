import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  error: null,
};

export default function poolsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_POOLS_BY_BATCH_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_POOLS_BY_BATCH_ID_SUCCESS: {
      return {
        ...state,
        items: action.payload.data.pools,
        // items: [...state.items, action.payload.data.results],
        total:
          action.payload.data.pools_published +
          action.payload.data.pools_unpublished,
        isLoading: false,
      };
    }
    case actions.FETCH_POOLS_BY_BATCH_ID_FAILURE: {
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
        items: action.payload.data.results,
        // items: [...state.items, action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
      };
    }
    case actions.FETCH_POOLS_BY_COMPANY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    // нужно с Philip запросы привести к единому стилю, сейчас state обновляется не правильно
    // fetch pools by batch id
    // fetch pools by company id
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
          if (pool.unique_id === action.payload.poolId) {
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
    default:
      return state;
  }
}
