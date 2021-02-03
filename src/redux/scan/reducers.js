import actions from './actions';
import { constants } from 'utils/constants';

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
  rackboard: {
    items: initialRackboard,
    isLoading: false,
    error: null,
  },
  companies: {
    items: [],
    total: 0,
    offset: 0,
    isLoading: false,
    error: null,
  },
};

export default function scanReducer(state = initialState, action) {
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
          items: action.payload.data,
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

    case actions.FETCH_COMPANIES_REQUEST: {
      return {
        ...state,
        companies: {
          ...state.companies,
          isLoading: true,
          error: null,
        },
      };
    }
    case actions.FETCH_COMPANIES_SUCCESS: {
      const newCompanies = action.payload.data.results.map(company => {
        return {
          ...company,
          key: company.company_id,
          label: company.name,
          value: company.company_id,
        };
      });

      const companies = action.payload.firstPage
        ? newCompanies
        : [...state.companies.items, ...newCompanies];

      return {
        ...state,
        companies: {
          ...state.companies,
          items: companies,
          total: action.payload.data.count,
          isLoading: false,
          offset: action.payload.firstPage
            ? constants?.pools?.itemsLoadingCount
            : state.companies.offset + constants?.pools?.itemsLoadingCount,
        },
      };
    }
    case actions.FETCH_COMPANIES_FAILURE: {
      return {
        ...state,
        companies: {
          ...state.companies,
          isLoading: false,
          // error: action.payload.data,
        },
      };
    }

    default:
      return state;
  }
}
