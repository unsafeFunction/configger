import actions from './actions';

const initialState = {
  isLoading: false,
};

export default function runTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CREATE_TEMPLATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.CREATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case actions.CREATE_TEMPLATE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
