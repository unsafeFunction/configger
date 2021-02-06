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
      console.log(action.payload.data);
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
          : [...state.items, ...scanSessionForRender],
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
  rack_id: null,
  pool_id: null,
  company_id: null,
  items: initialRackboard,
  isLoading: false,
  error: null,
};

export default combineReducers({
  sessions: sessionsReducer,
  singleScan: single({
    types: [],
  })((state = initialSingleScan, action = {}) => {
    switch (action.type) {
      case actions.FETCH_POOL_SCAN_BY_ID_REQUEST: {
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      }
      case actions.FETCH_POOL_SCAN_BY_ID_SUCCESS: {
        return {
          ...state,
          isLoading: false,
          ...action.payload,
        };
      }
      case actions.FETCH_POOL_SCAN_BY_ID_FAILURE: {
        return {
          ...state,
          isLoading: false,
        };
      }

      case actions.UPDATE_TUBE_REQUEST: {
        return {
          ...state,
        };
      }
      case actions.UPDATE_TUBE_SUCCESS: {
        return {
          ...state,
          items: state.items.map(row => {
            if (row.letter === action.payload.data.letter) {
              return {
                ...row,
                ...action.payload.data,
                // isUpdating: false,
              };
            }
            return row;
          }),
        };
      }
      case actions.UPDATE_TUBE_FAILURE: {
        return {
          ...state,
          items: state.items.map(row => {
            if (row.letter === action?.payload?.letter) {
              return {
                ...row,
                // resultIsUpdating: false,
              };
            }
            return row;
          }),
        };
      }

      default: {
        return state;
      }
    }
  }),
});
