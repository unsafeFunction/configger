import actions from './actions';

const initialState = {
  modalType: null,
  modalProps: {},
  isOpen: false,
  error: '',
  isDisabled: false,
  isLoadFile: true,
  isLoading: false,
};
export default function modal(state = initialState, action) {
  switch (action.type) {
    case actions.SHOW_MODAL: {
      return Object.assign({}, state, {
        modalType: action.modalType,
        modalProps: action.modalProps,
        isOpen: true,
      });
    }
    case actions.HIDE_MODAL: {
      return {
        ...initialState,
        isLoading: false,
      };
    }
    case actions.SET_ERROR: {
      return Object.assign({}, state, {
        error: action.payload,
        isDisabled: !!action.payload,
      });
    }
    case actions.UPDATE_SCAN_BY_ID_REQUEST:
    case actions.PATCH_INTAKE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    default:
      return state;
  }
}
