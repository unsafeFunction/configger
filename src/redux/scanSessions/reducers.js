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

    case actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        items: state.items.map((session) => {
          if (session.id === data.id) {
            session.samples_count = data.samples_count;
          }
          return session;
        }),
      };
    }

    case actions.DELETE_SCAN_BY_ID_SUCCESS: {
      const { sessionId, scanId } = action.payload;

      return {
        ...state,
        items: state.items.map((session) => {
          if (session.id === sessionId) {
            session.scans = session.scans.filter((id) => id !== scanId);
          }
          return session;
        }),
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
  scannerObj: {},
  activeSessionId: null,
  activeSessionLoading: false,
  intakeLogs: [],
  companyInfoLoading: false,
  reference_pools_count: 0,
  reference_samples_count: 0,
  requestStatus: 200,
};

const getScanName = (scan) => {
  if (scan?.scan_name) {
    return scan.scan_name;
  }
  return scan?.ordinal_name;
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
        activeSessionId: state.activeSessionId,
      };
    }
    case actions.FETCH_SCAN_SESSION_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
        session_id: action.payload.data.id,
        scans: action.payload.data.scans?.map((scan) => ({
          ...scan,
          scan_name: getScanName(scan),
        })),
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

    case actions.CREATE_SESSION_REQUEST: {
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
    case actions.FETCH_SESSION_ID_REQUEST: {
      return {
        ...state,
        ...initialSingleSession,
        activeSessionLoading: true,
      };
    }
    case actions.FETCH_SESSION_ID_SUCCESS: {
      return {
        ...state,
        activeSessionLoading: false,
        ...action.payload.data,
        activeSessionId: action.payload?.data?.session_id,
        activeSessionStarted: action.payload?.data?.started_on_day,
        sessionLength: action.payload?.data?.session_length,
      };
    }
    case actions.FETCH_SESSION_ID_FAILURE: {
      return {
        ...state,
        activeSessionLoading: false,
      };
    }

    case actions.FETCH_ACTIVE_SCANS_REQUEST: {
      return {
        ...state,
        requestStatus: null,
      };
    }
    case actions.FETCH_ACTIVE_SCANS_SUCCESS: {
      const freshScans = action.payload.data.map((scan) => {
        return {
          ...scan,
          scan_name: getScanName(scan),
        };
      });

      return {
        ...state,
        requestStatus: action.payload?.status,
        scans: [...state.scans, ...freshScans],
      };
    }
    case actions.FETCH_ACTIVE_SCANS_FAILURE: {
      return {
        ...state,
        requestStatus: 'failure_status',
      };
    }

    case actions.CHECK_SCANNER_STATUS_BY_ID_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.CHECK_SCANNER_STATUS_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        scannerObj: action.payload.data,
      };
    }
    case actions.CHECK_SCANNER_STATUS_BY_ID_FAILURE: {
      return {
        ...state,
        isLoading: false,
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
              ...(scanData.scan_name || scanData.ordinal_name
                ? { scan_name: getScanName(scanData) }
                : {}),
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
  popoverContent: null,
  error: null,
};

const scanReducer = (state = initialScan, action) => {
  switch (action.type) {
    case actions.UPDATE_POPOVER_STATE: {
      const { popoverContent } = action.payload;

      return {
        ...state,
        popoverContent,
      };
    }
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
      const scan = action.payload.data;
      return {
        ...state,
        isLoading: false,
        ...scan,
        scan_name: getScanName(scan),
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
    case actions.CANCEL_SCAN_BY_ID_SUCCESS: {
      const scan = action.payload.data;
      return {
        ...state,
        ...scan,
        scan_name: getScanName(scan),
        isLoading: false,
      };
    }

    case actions.VOID_SCAN_BY_ID_SUCCESS: {
      return {
        ...state,
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

    case actions.DELETE_SCAN_BY_ID_REQUEST: {
      return {
        ...state,
        ...initialSingleSession,
        isLoading: true,
      };
    }
    case actions.DELETE_SCAN_BY_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.DELETE_SCAN_BY_ID_FAILURE: {
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
