import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  total: 0,
  error: null,
};

export default function intakeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INTAKE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_INTAKE_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data
          : [...state.items, ...action.payload.data],
        total: action.payload.total,
        offset: action.payload.firstPage
          ? constants?.pools?.itemsLoadingCount
          : state.offset + constants?.pools?.itemsLoadingCount,
        isLoading: false,
      };
    }
    case actions.FETCH_INTAKE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
