import { combineReducers } from 'redux';
import { constants } from 'utils/constants';
import actions from './actions';

const initialState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
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
  intakeLogs: [],
  companyInfoLoading: false,
  reference_pools_count: 0,
  reference_samples_count: 0,
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
        ...initialSingleSession,
        isLoading: true,
      };
    }
    case actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
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

    case actions.CREATE_SESSION_REQUEST:
    case actions.FETCH_SESSION_ID_REQUEST: {
      return {
        ...state,
        ...initialSingleSession,
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
    case actions.CREATE_SESSION_FAILURE: {
      return {
        ...state,
        isLoading: false,
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

    case actions.FETCH_COMPANY_INFO_REQUEST: {
      return {
        ...state,
        companyInfoLoading: true,
        error: null,
      };
    }
    case actions.FETCH_COMPANY_INFO_SUCCESS: {
      return {
        ...state,
        companyInfoLoading: false,
        intakeLogs: action.payload.data,
      };
    }
    case actions.FETCH_COMPANY_INFO_FAILURE: {
      return {
        ...state,
        companyInfoLoading: false,
        intakeLogs: [],
      };
    }

    case actions.FETCH_ACTIVE_SCANS_REQUEST: {
      return {
        ...state,
      };
    }
    case actions.FETCH_ACTIVE_SCANS_SUCCESS: {
      return {
        ...state,
        scans: [...state.scans, ...action.payload.data],
      };
    }
    case actions.FETCH_ACTIVE_SCANS_FAILURE: {
      return {
        ...state,
      };
    }

    case actions.CHANGE_SESSION_DATA: {
      const { scanId, scanData } = action.payload.data;
      return {
        ...state,
        scans: state.scans.map((scan) => {
          if (scan.id === scanId) {
            return {
              ...scan,
              ...scanData,
            };
          }
          return scan;
        }),
      };
    }

    default:
      return state;
  }
};

const initialScan = {
  isLoading: false,
  id: null,
  pool_id: null,
  scan_name: null,
  rack_id: null,
  possibly_reversed: false,
  empty_positions: [],
  incorrect_positions: [],
  status: null,
  scanner: {},
  scan_timestamp: null,
  scanned_by: null,
  last_modified_by: null,
  last_modified_on: null,
  modifications: [],
  scan_order: null,
  tubes_count: null,
  scan_tubes: [],
  items: [],
  error: null,
};

const scanReducer = (state = initialScan, action) => {
  switch (action.type) {
    case actions.RESET_SCAN: {
      return {
        ...state,
        ...initialScan,
      };
    }

    case actions.FETCH_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        ...initialScan,
        isLoading: true,
      };
    }
    case actions.FETCH_SCAN_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
      };
    }
    case actions.FETCH_SCAN_BY_ID_FAILURE: {
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
      const { row, tube, scanData } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        ...scanData,
        items: state.items.map((item) => {
          if (item.letter === row.letter) {
            return {
              ...item,
              ...row,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
            };
          }
          return item;
        }),
        scan_tubes: state.scan_tubes.map((tubeItem) => {
          return tubeItem.id === tube.id ? tube : tubeItem;
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
      const { row, tube, scanData } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        ...scanData,
        items: state.items.map((item) => {
          if (item.letter === row.letter) {
            return {
              ...item,
              ...row,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
            };
          }
          return item;
        }),
        scan_tubes: state.scan_tubes.map((tubeItem) => {
          return tubeItem.id === tube.id ? tube : tubeItem;
        }),
      };
    }
    case actions.INVALIDATE_TUBE_FAILURE: {
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
      const { row, tube, scanData } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        ...scanData,
        items: state.items.map((item) => {
          if (item.letter === row.letter) {
            return {
              ...item,
              ...row,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
            };
          }
          return item;
        }),
        scan_tubes: state.scan_tubes.map((tubeItem) => {
          return tubeItem.id === tube.id ? tube : tubeItem;
        }),
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
    case actions.CANCEL_SCAN_BY_ID_REQUEST:
    case actions.VOID_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case actions.UPDATE_SCAN_BY_ID_SUCCESS:
    case actions.CANCEL_SCAN_BY_ID_SUCCESS:
    case actions.VOID_SCAN_BY_ID_SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        ...data,
        isLoading: false,
      };
    }

    case actions.UPDATE_SCAN_BY_ID_FAILURE:
    case actions.CANCEL_SCAN_BY_ID_FAILURE:
    case actions.VOID_SCAN_BY_ID_FAILURE: {
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
  scan: scanReducer,
});
