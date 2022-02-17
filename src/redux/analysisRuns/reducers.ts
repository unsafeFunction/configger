import omit from 'lodash.omit';
import { combineReducers } from 'redux';
import { excludeReservedSamples } from 'utils/analysisRules';
import { roundValueToSecondNumber } from 'utils/roundRules';
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

type ActionType = {
  type: string;
  payload: PayloadType;
};

type SingleActionType = {
  type: string;
  payload: SinglePayloadType;
};

export type PayloadType = {
  firstPage: boolean;
  data: DataType;
  id: string;
  items: ItemType[];
};

export type SinglePayloadType = {
  data: SingleDataType;
  id: string;
  field: string;
  items: SingleItemType[];
};

type DataType = {
  count: number;
  results: ItemType[];
};

type SingleDataType = {
  items: SingleItemType[];
  run_method: string;
  status: string;
  title: string;
  id: string;
};

export type SingleItemType = {
  analysis_result: string;
  auto_publish: boolean;
  children: RunChildren[];
  company_short: string;
  display_sample_id: string;
  mean: Deviation;
  pool_name: string;
  rerun_action: string;
  result_interpreted: string;
  sample_id: string;
  sort_index: number;
  standard_deviation: Deviation;
  tube_id: string;
  tube_type: string;
  wells: string;
};

type RunChildren = {
  N1: string;
  N1_amp_status: string;
  N1_cq_confidence: string;
  ORF10: string;
  ORF10_amp_status: string;
  ORF10_cq_confidence: string;
  RP: string;
  RP_amp_status: string;
  RP_cq_confidence: string;
  wells: string;
};

type Deviation = {
  N1: string;
  ORF10: string;
  RP: string;
};

export type ItemType = {
  id: string;
  method: string;
  plate: string;
  qs_machine: string;
  rackscans: string[];
  replication: string;
  samples_count: number;
  start_column: number;
  status: string;
  title: string;
  type: string;
  user: string;
};

const runsReducer = (state = initialRunsState, action: ActionType) => {
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
        items: state.items.map((item: ItemType) => {
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

const formatResults = (items: SingleItemType[]) => {
  const samples = excludeReservedSamples(items);

  // TODO: REFACTOR ANY TYPES;

  return samples.map((parentRow: any) => {
    let warning_flag = false;

    const formattedWells = parentRow.children?.map((childRow: any) => {
      let targetProps = {};

      constants.targets.all.forEach((target: string) => {
        if (childRow[target] && !isNaN(childRow[target])) {
          const cqConfidence = roundValueToSecondNumber(
            childRow[`${target}_cq_confidence`],
          );
          const inconclusiveAmpStatus =
            childRow[`${target}_amp_status`].toLowerCase() ===
            constants.ampStatuses.inconclusive;
          // TODO: REFACTOR IGNORE
          if (
            // @ts-ignore
            cqConfidence > 0 &&
            // @ts-ignore
            cqConfidence <= 0.7 &&
            inconclusiveAmpStatus
          ) {
            warning_flag = true;
            targetProps = {
              ...targetProps,
              [`${target}_warning_msg`]: `Cq confidence is low! (${cqConfidence}) Amplification is inconclusive`,
            };
          }
          // @ts-ignore
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

const singleRunReducer = (
  state = initialRunState,
  action: SingleActionType,
) => {
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
        items: state.items.map((sample: SingleItemType) => {
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
        items: state.items.map((sample: SingleItemType) => {
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
        items: state.items.map((sample: SingleItemType) => {
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
