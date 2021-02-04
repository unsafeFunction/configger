/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import { constants } from 'utils/constants';
import actions from './actions';

const initialRackboard = [...Array(6).keys()].map(i => ({
  letter: String.fromCharCode(constants?.A + i),
  col1: { tube_id: null, status: 'empty' },
  col2: { tube_id: null, status: 'empty' },
  col3: { tube_id: null, status: 'empty' },
  col4: { tube_id: null, status: 'empty' },
  col5: { tube_id: null, status: 'empty' },
  col6: { tube_id: null, status: 'empty' },
  col7: { tube_id: null, status: 'empty' },
  col8: { tube_id: null, status: 'empty' },
}));

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const sessionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_SCAN_SESSIONS_REQUEST: {
      return {
        ...state,
        isLoading: false,
        search: action.payload.search,
      };
    }
    case actions.FETCH_SCAN_SESSIONS_SUCCESS: {
      const scanSessionForRender = action.payload.data.map(session => {
        return {
          ...session,
          action: null,
        };
      });

      const { scanSessions } = constants;
      const { total, firstPage } = action.payload;

      return {
        ...state,
        items: firstPage
          ? scanSessionForRender
          : [
            ...state.items,
            ...scanSessionForRender,
          ],
        total,
        isLoading: true,
        offset: firstPage
          ? scanSessions.itemsLoadingCount
          : state.offset + scanSessions.itemsLoadingCount,
      };
    }
    case actions.FETCH_SCAN_SESSIONS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    default:
      return state;
  }
};

const initialSingleScan = {
  rackboard: {
    rack_id: null,
    pool_id: null,
    company_id: null,
    items: initialRackboard,
    isLoading: false,
    error: null,
  },
};

export default combineReducers({
  sessions: sessionsReducer,
  singleScan: single({
    types: [],
  })((state = initialSingleScan, action = {}) => {
    switch (action.type) {
      case actions.FETCH_SAMPLES_REQUEST: {
        return {
          ...state,
          rackboard: {
            ...state.rackboard,
            isLoading: true,
            error: null,
          },
        };
      }
      case actions.FETCH_SAMPLES_SUCCESS: {
        return {
          ...state,
          rackboard: {
            ...state.rackboard,
            isLoading: false,
            // items: {
            //   ...state.rackboard.items,
            //   ...action.payload.data,
            // },
            // items: action.payload.data,
            ...action.payload,
          },
        };
      }
      case actions.FETCH_SAMPLES_FAILURE: {
        return {
          ...state,
          rackboard: {
            ...state.rackboard,
            isLoading: false,
          },
        };
      }
      default: {
        return state;
      }
    }
  }),
});
