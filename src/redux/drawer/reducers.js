import actions from './actions';

const initialState = {
  drawerProps: {},
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
    default:
      return state;
  }
}
