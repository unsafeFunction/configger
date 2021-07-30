import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
};

const timelineReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD_TIMELINE_REQUEST: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.LOAD_TIMELINE_SUCCESS: {
      const { data } = action.payload;

      return {
        items: data,
        isLoading: true,
      };
    }
    case actions.LOAD_TIMELINE_FAILURE:
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
};

export default timelineReducer;
