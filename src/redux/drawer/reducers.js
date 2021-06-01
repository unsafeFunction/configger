import actions from './actions';

const initialState = {
  drawerProps: {},
  footerProps: {},
  content: null,
  isOpen: false,
  error: '',
  isDisabled: false,
  isLoading: false,
};

export default function drawerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SHOW_DRAWER: {
      return {
        ...state,
        drawerProps: action.drawerProps,
        footerProps: action.footerProps,
        content: action.content,
        isOpen: true,
      };
    }
    case actions.HIDE_DRAWER: {
      return {
        ...initialState,
      };
    }
    case actions.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        isDisabled: !!action.payload,
      };
    }
    case actions.UPDATE_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_SCAN_BY_ID_SUCCESS:
    case actions.UPDATE_SCAN_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
