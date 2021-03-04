import { combineReducers } from 'redux';
import single from 'redux/factories/single';
import actions from './actions';
import { constants } from '../../utils/constants';

const initialState = {
  items: [],
  error: null,
  isLoading: false,
  offset: 0,
  total: 0,
  page: 1,
  search: '',
};

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INVENTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.FETCH_INVENTORY_SUCCESS: {
      const inventoryItemsForRender = action.payload.data.map(item => {
        return {
          ...item,
          action: null,
        };
      });

      const { inventory } = constants;
      const { total, firstPage } = action.payload;

      return {
        ...state,
        items: firstPage
          ? inventoryItemsForRender
          : [...state.items, ...inventoryItemsForRender],
        total,
        isLoading: false,
        offset: firstPage
          ? inventory.itemsLoadingCount
          : state.offset + inventory.itemsLoadingCount,
      };
    }
    case actions.FETCH_INVENTORY_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
    }
    default:
      return state;
  }
}
