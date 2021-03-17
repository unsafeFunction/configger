import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import forEach from 'lodash.foreach';
import actions from './actions';

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
      const scanSessionForRender = action.payload.data.map((session) => {
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
  activeSessionId: null,
  activeSessionLoading: false,
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
      const { pool_id } = action.payload.data;

      return {
        ...state,
        isLoading: false,
        scans: state.scans.map((scan) => {
          if (scan.id === action.payload.data.scanId) {
            return {
              ...scan,
              items: scan.items.map((row) => {
                if (row.letter === action.payload.data.row.letter) {
                  return {
                    ...row,
                    ...action.payload.data.row,
                  };
                }
                return row;
              }),
              ...(pool_id ? { pool_id } : {}),
            };
          }
          return scan;
        }),
      };
    }
    case actions.UPDATE_TUBE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.INVALIDATE_TUBE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.INVALIDATE_TUBE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        scans: state.scans.map((scan) => {
          if (scan.id === action.payload.data.scanId) {
            return {
              ...scan,
              items: scan.items.map((row) => {
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
    case actions.INVALIDATE_TUBE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.CREATE_SESSION_REQUEST:
    case actions.FETCH_SESSION_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CREATE_SESSION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        activeSessionId: action.payload.sessionId,
      };
    }
    case actions.FETCH_SESSION_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        activeSessionId: action.payload.sessionId
          ? action.payload.sessionId
          : undefined,
      };
    }
    case actions.FETCH_SESSION_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.DELETE_TUBE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case actions.DELETE_TUBE_SUCCESS: {
      const { tube, scanId, tubeId } = action.payload.data;
      const scansArray = state.scans;

      state.scans.forEach((row, index) => {
        if (row.id === scanId) {
          row.items.forEach((value, key) => {
            forEach(value, (rowValue, rowKey) => {
              if (rowValue.id === tubeId) {
                scansArray[index].items[key][rowKey] = tube;
              }
            });
          });
        }
      });

      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.DELETE_TUBE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
    }

    case actions.UPDATE_SCAN_BY_ID_REQUEST:
    case actions.CANCEL_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CANCEL_SCAN_BY_ID_SUCCESS:
    case actions.UPDATE_SCAN_BY_ID_SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        isLoading: false,
        scans: state.scans.map((scan) => {
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
        scans: state.scans.map((scan) => {
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
    case actions.CANCEL_SCAN_BY_ID_FAILURE:
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
