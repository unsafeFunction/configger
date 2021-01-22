import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import actions from './actions';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  total: 0,
  page: 1,
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

const initialSingleCampaign = {
  error: null,
  isLoading: false,
};

export default combineReducers({
  all: timelineReducer,
  singleCampaign: single({
    types: [],
  })((state = initialSingleCampaign, action = {}) => {
    switch (action.type) {
      case 'modal/HIDE_MODAL': {
        return {
          ...initialState,
        };
      }
      case actions.ON_COMPANY_DATA_CHANGE:
        return Object.assign({}, state, {
          [action?.payload?.name]: action?.payload?.value,
        });
      default: {
        return state;
      }
    }
  }),
});
