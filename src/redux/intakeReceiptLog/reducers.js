import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  error: null,
  isCreating: false,
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
        isCreating: true,
        error: null,
      };
    case actions.CREATE_INTAKE_SUCCESS:
      return {
        ...state,
        items: [action.payload.data, ...state.items],
        isCreating: false,
      };
    case actions.CREATE_INTAKE_FAILURE: {
      return {
        ...state,
        isCreating: false,
        error: action.payload.data,
      };
    }
    case actions.PATCH_INTAKE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actions.PATCH_INTAKE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        isLoading: false,
      };
    case actions.PATCH_INTAKE_FAILURE: {
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
