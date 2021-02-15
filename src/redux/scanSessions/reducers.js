import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import { constants } from 'utils/constants';
import forEach from 'lodash.foreach';
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

const initialSingleSession = {
  isLoading: false,
  error: null,
  status: null,
  id: null,
  scan_session_title: null,
  company_short: {},
  scanned_by: null,
  scans: [],
  started_on_day: null,
  selectedCode: {},
};

const singleSessionReducer = (state = initialSingleSession, action) => {
  switch (action.type) {
    case actions.UPDATE_SELECTED_CODE_REQUEST: {
      return {
        ...state,
        selectedCode: action.payload,
      };
    }
    case actions.UPDATE_SELECTED_CODE_SUCCESS: {
      return {
        ...state,
        selectedCode: {},
      };
    }
    case actions.FETCH_SCAN_SESSION_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };
    }
    case actions.FETCH_SCAN_SESSION_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_SESSION_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_SESSION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPDATE_SESSION_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_TUBE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_TUBE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        scans: state.scans.map(scan => {
          if (scan.id === action.payload.data.scanId) {
            return {
              ...scan,
              items: scan.items.map(row => {
                if (row.letter === action.payload.data.row.letter) {
                  return {
                    ...row,
                    ...action.payload.data.row,
                  };
                }
                return row;
              }),
            };
          }
          return scan;
        }),
      };
    }
    case actions.UPDATE_TUBE_FAILURE: {
      return {
        ...state,
        // items: state.items.map(row => {
        //   if (row.letter === action?.payload?.letter) {
        //     return {
        //       ...row,
        //       // resultIsUpdating: false,
        //     };
        //   }
        //   return row;
        // }),
      };
    }
    case actions.DELETE_TUBE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.DELETE_TUBE_SUCCESS: {
      const { data } = action.payload;
      const testArray = state.scans;

      state.scans.forEach((row, index) => {
        if (row.id === data?.scan_id) {
          row.items.forEach((value, key) => {
            forEach(value, (rowValue, rowKey) => {
              if (rowValue.id === data.tube_id) {
                testArray[index].items[key][rowKey].status = 'empty';
              }
            });
          });
        }
      });

      return {
        ...state,
        isLoading: false,
        // items: testArray,
      };
    }
    case actions.DELETE_TUBE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        // items: state.items.map(row => {
        //   if (row.letter === action?.payload?.letter) {
        //     return {
        //       ...row,
        //       // resultIsUpdating: false,
        //     };
        //   }
        //   return row;
        // }),
      };
    }

    case actions.UPDATE_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case actions.UPDATE_SCAN_BY_ID_SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        isLoading: false,
        scans: state.scans.map(scan => {
          if (scan.id === data.id) {
            return {
              ...scan,
              ...data,
            };
          }
          return scan;
        }),
      };
    }

    case actions.VOID_SCAN_BY_ID_SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        isLoading: false,
        scans: state.scans.map(scan => {
          if (scan.id === data.id) {
            return {
              ...scan,
              status: 'VOIDED',
            };
          }
          return scan;
        }),
      };
    }

    case actions.UPDATE_SCAN_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  sessions: sessionsReducer,
  singleSession: singleSessionReducer,
});
