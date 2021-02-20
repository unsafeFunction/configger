import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
};

export default function intakeReceiptLogReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INTAKE_LOG_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_INTAKE_LOG_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        items: action.payload.firstPage
          ? action.payload.data
          : [...state.items, ...action.payload.data],
        total: action.payload.total,
        offset: action.payload.firstPage
          ? constants?.intakeLog?.itemsLoadingCount
          : state.offset + constants?.intakeLog?.itemsLoadingCount,
      };
    }
    case actions.FETCH_INTAKE_LOG_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
    }

    case actions.CREATE_INTAKE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.CREATE_INTAKE_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        isLoading: false,
      };
    case actions.CREATE_INTAKE_FAILURE: {
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
