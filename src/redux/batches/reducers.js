import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  error: null,
  // page: 1,
};

export default function batchesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_BATCHES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_BATCHES_SUCCESS: {
      return {
        ...state,
        items: action.payload.data.results,
        // items: [...state.items, action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
      };
    }
    case actions.FETCH_BATCHES_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // error: action.payload.data,
      };
    }

    case actions.PUBLISH_BATCH_REQUEST: {
      // console.log('PUBLISH_BATCH_REQUEST action', action);
      return {
        ...state,
        items: state.items.map(batch => {
          if (batch.unique_id === action.payload.batchId) {
            return {
              ...batch,
              isUpdating: true,
            };
          }
          return batch;
        }),
      };
    }
    case actions.PUBLISH_BATCH_SUCCESS: {
      return {
        ...state,
        items: state.items.map(batch => {
          if (batch.unique_id === action.payload.data.unique_id) {
            return {
              ...batch,
              ...action.payload.data,
              isUpdating: false,
            };
          }
          return batch;
        }),
      };
    }
    case actions.PUBLISH_BATCH_FAILURE: {
      return {
        ...state,
        items: state.items.map(batch => {
          if (batch.unique_id === action.payload.batchId) {
            return {
              ...batch,
              isUpdating: false,
            };
          }
          return batch;
        }),
        // error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
