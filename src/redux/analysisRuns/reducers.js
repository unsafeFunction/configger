import omit from 'lodash.omit';
import { combineReducers } from 'redux';
import {
  isReservedSample,
  isUnusedSample,
  roundValue,
} from 'utils/analysisRules';
import { constants } from 'utils/constants';
import actions from './actions';

const initialRunsState = {
  items: [],
  isLoading: false,
  total: 0,
  offset: 0,
  search: '',
  error: null,
};

const runsReducer = (state = initialRunsState, action) => {
  switch (action.type) {
    case actions.FETCH_RUNS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_RUNS_SUCCESS: {
      return {
        ...state,
        items: action.payload.firstPage
          ? action.payload.data.results
          : [...state.items, ...action.payload.data.results],
        total: action.payload.data.count,
        isLoading: false,
        offset: action.payload.firstPage
          ? constants?.runs?.itemsLoadingCount
          : state.offset + constants?.runs?.itemsLoadingCount,
      };
    }
    case actions.FETCH_RUNS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case actions.UPLOAD_RUN_RESULT_SUCCESS: {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...omit(action.payload, ['items']),
              samples_count: action.payload.items.length,
            };
          }
          return item;
        }),
      };
    }

    default:
      return state;
  }
};

const initialRunState = {
  id: null,
  status: null,
  items: [],
  isLoading: false,
  wellplates: [],
};

const excludeReservedSamples = (items) =>
  items
    .filter?.((item) => !isUnusedSample(item.display_sample_id))
    .map?.((item) => {
      if (isReservedSample(item.display_sample_id)) {
        return omit(item, ['children', 'rerun_action']);
      }
      return item;
    });

const formatResults = (items = []) => {
  const samples = excludeReservedSamples(items);

  return samples.map((parentRow) => {
    let warning_flag = false;

    const formattedWells = parentRow.children?.map((childRow) => {
      let targetProps = {};

      constants.targets.map((target) => {
        if (childRow[target] && !isNaN(childRow[target])) {
          const cqConfidence = roundValue(childRow[`${target}_cq_confidence`]);
          const inconclusiveAmpStatus =
            childRow[`${target}_amp_status`].toLowerCase() ===
            constants.ampStatuses.inconclusive;
          if (
            cqConfidence > 0 &&
            cqConfidence <= 0.7 &&
            inconclusiveAmpStatus
          ) {
            warning_flag = true;
            targetProps = {
              ...targetProps,
              [`${target}_warning_msg`]: `Cq confidence is low! (${cqConfidence}) Amplification is inconclusive`,
            };
          }
          if (cqConfidence > 0 && cqConfidence <= 0.7) {
            warning_flag = true;
            targetProps = {
              ...targetProps,
              [`${target}_warning_msg`]: `Cq confidence is low! (${cqConfidence})`,
            };
          }
          if (inconclusiveAmpStatus) {
            warning_flag = true;
            targetProps = {
              ...targetProps,
              [`${target}_warning_msg`]: 'Amplification is inconclusive',
            };
          }
        }
      });

      return {
        ...childRow,
        ...targetProps,
      };
    });

    return {
      ...parentRow,
      warning_flag,
      children: formattedWells,
    };
  });
};

const singleRunReducer = (state = initialRunState, action) => {
  switch (action.type) {
    case actions.FETCH_RUN_REQUEST: {
      return {
        ...initialRunState,
        isLoading: true,
      };
    }
    case actions.FETCH_RUN_SUCCESS: {
      const { items } = action.payload.data;

      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
        items: formatResults(items),
      };
    }
    case actions.FETCH_RUN_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPDATE_SAMPLE_REQUEST: {
      const { id, field } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === id) {
            return {
              ...sample,
              [`${field}IsUpdating`]: true,
            };
          }
          return sample;
        }),
      };
    }
    case actions.UPDATE_SAMPLE_SUCCESS: {
      const { field, data } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === data.id) {
            return {
              ...sample,
              ...data,
              [`${field}IsUpdating`]: false,
            };
          }
          return sample;
        }),
      };
    }
    case actions.UPDATE_SAMPLE_FAILURE: {
      const { id, field } = action.payload;
      return {
        ...state,
        items: state.items.map((sample) => {
          if (sample.sample_id === id) {
            return {
              ...sample,
              [`${field}IsUpdating`]: false,
            };
          }
          return sample;
        }),
      };
    }

    case actions.UPDATE_RUN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.UPDATE_RUN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload.data,
      };
    }
    case actions.UPDATE_RUN_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.FETCH_WELLPLATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.FETCH_WELLPLATE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        wellplates: action.payload.data,
      };
    }
    case actions.FETCH_WELLPLATE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case actions.UPLOAD_RUN_RESULT_SUCCESS: {
      const { items } = action.payload;

      return {
        ...initialRunState,
        ...action.payload,
        items: formatResults(items),
      };
    }

    default:
      return state;
  }
};

export default combineReducers({
  all: runsReducer,
  singleRun: singleRunReducer,
});
