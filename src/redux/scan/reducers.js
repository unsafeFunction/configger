import actions from './actions';
import { constants } from 'utils/constants';

const initialRackboard = [...Array(6).keys()].map(i => ({
  letter: String.fromCharCode(constants?.A + i),
  col1: { tube_id: null, status: 'empty' },
  col2: { tube_id: null, status: 'empty' },
  col3: { tube_id: null, status: 'empty' },
  col4: { tube_id: null, status: 'empty' },
  col5: { tube_id: null, status: 'empty' },
  col6: { tube_id: null, status: 'empty' },
  col7: { tube_id: null, status: 'empty' },
  col8: { tube_id: null, status: 'empty' },
}));

const initialState = {
  rackboard: {
    items: initialRackboard,
    isLoading: false,
    error: null,
  },
};

export default function scanReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_SAMPLES_REQUEST: {
      return {
        ...state,
        rackboard: {
          ...state.rackboard,
          isLoading: true,
          error: null,
        },
      };
    }
    case actions.FETCH_SAMPLES_SUCCESS: {
      return {
        ...state,
        rackboard: {
          ...state.rackboard,
          isLoading: false,
          items: action.payload.data.results,
        },
      };
    }
    case actions.FETCH_SAMPLES_FAILURE: {
      return {
        ...state,
        rackboard: {
          ...state.rackboard,
          isLoading: false,
        },
      };
    }

    default:
      return state;
  }
}
