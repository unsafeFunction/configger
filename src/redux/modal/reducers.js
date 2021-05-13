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
    case actions.INVALIDATE_TUBE_REQUEST:
    case actions.UPDATE_TUBE_REQUEST:
    case actions.UPDATE_SCAN_BY_ID_REQUEST:
    case actions.PATCH_INTAKE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.INVALIDATE_TUBE_SUCCESS:
    case actions.INVALIDATE_TUBE_FAILURE:
    case actions.UPDATE_TUBE_SUCCESS:
    case actions.UPDATE_TUBE_FAILURE:
    case actions.UPDATE_SCAN_BY_ID_SUCCESS:
    case actions.UPDATE_SCAN_BY_ID_FAILURE:
    case actions.PATCH_INTAKE_SUCCESS:
    case actions.PATCH_INTAKE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
