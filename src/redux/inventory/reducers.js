import { constants } from 'utils/constants';
import actions from './actions';

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
      const inventoryItemsForRender = action.payload.data.map((item) => {
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
    case actions.CREATE_INVENTORY_ITEM_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actions.CREATE_INVENTORY_ITEM_SUCCESS:
      return {
        ...state,
        items: [action.payload.data, ...state.items],
        isLoading: false,
      };
    case actions.CREATE_INVENTORY_ITEM_FAILURE: {
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
