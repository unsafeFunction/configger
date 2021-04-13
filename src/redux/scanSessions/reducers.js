import forEach from 'lodash.foreach';
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
      const { pool_id, tube, scanId } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        scans: state.scans.map((scan) => {
          if (scan.id === scanId) {
            console.log(
              scan,
              constants.tubes.incorrectLetters.includes(tube?.position?.[0]),
              tube?.position?.[0],
              constants.tubes.incorrectLetters,
            );
            return {
              ...scan,
              empty_positions:
                tube?.status === constants.tubes.deleted.status &&
                !constants.tubes.incorrectLetters.includes(tube?.position?.[0])
                  ? [...scan.empty_positions, tube?.position]
                  : tube?.status !== constants.tubes.deleted.status &&
                    !constants.tubes.incorrectLetters.includes(
                      tube?.position?.[0],
                    )
                  ? scan.empty_positions.filter(
                      (position) => position !== tube?.position,
                    )
                  : scan.empty_positions,
              incorrect_positions: constants.tubes.incorrectLetters.includes(
                tube?.position?.[0],
              )
                ? [...scan.incorrect_positions, tube?.position]
                : scan.incorrect_positions,
              items: scan.items.map((row) => {
                if (row.letter === action.payload.data.row.letter) {
                  return {
                    ...row,
                    last_modified_on: tube.last_modified_on,
                    last_modified_by: tube.last_modified_by,
                    ...action.payload.data.row,
                  };
                }
                return row;
              }),
              scan_tubes: scan.scan_tubes.map((tubeItem) => {
                return tubeItem.id === tube.id ? tube : tubeItem;
              }),
              ...(pool_id ? { pool_id } : {}),
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
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
      const { tube } = action.payload.data;
      return {
        ...state,
        isLoading: false,
        scans: state.scans.map((scan) => {
          if (scan.id === action.payload.data.scanId) {
            return {
              ...scan,
              last_modified_on: tube.last_modified_on,
              last_modified_by: tube.last_modified_by,
              items: scan.items.map((row) => {
                if (row.letter === action.payload.data.row.letter) {
                  return {
                    ...row,
                    ...action.payload.data.row,
                  };
                }
                return row;
              }),
              scan_tubes: scan.scan_tubes.map((tubeItem) => {
                return tubeItem.id === tube.id ? tube : tubeItem;
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
        scans: state.scans.map((scan) => {
          if (scan.id === scanId) {
            console.log(scan);
            return {
              ...scan,
              empty_positions:
                tube?.status === constants.tubes.deleted.status &&
                !constants.tubes.incorrectLetters.includes(tube?.position?.[0])
                  ? [...scan.empty_positions, tube?.position]
                  : scan.empty_positions,
              incorrect_positions: constants.tubes.incorrectLetters.includes(
                tube?.position?.[0],
              )
                ? scan.incorrect_positions?.filter(
                    (position) => position !== tube?.position,
                  )
                : scan.incorrect_positions,
              scan_tubes: scan.scan_tubes.map((tubeItem) => {
                return tubeItem.id === tubeId ? tube : tubeItem;
              }),
            };
          }
          return scan;
        }),
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

    case actions.FETCH_SCAN_BY_ID_SUCCESS: {
      console.log(action.payload);
      return {
        scans: state.scans.map((scan) => {
          if (scan.id === action.payload.id) {
            return {
              ...scan,
              ...action.payload,
            };
          }
          return scan;
        }),
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

    default:
      return state;
  }
};

export default combineReducers({
  sessions: sessionsReducer,
  singleSession: singleSessionReducer,
});
