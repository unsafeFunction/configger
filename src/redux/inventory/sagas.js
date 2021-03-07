import { all, takeEvery, put, call } from 'redux-saga/effects';
import { fetchInventory, createInventoryItem } from 'services/inventory';
import { notification } from 'antd';
import actions from './actions';
import modalActions from '../modal/actions';

export function* callFetchInventory({ payload }) {
  try {
    const { data } = yield call(fetchInventory, payload);

    yield put({
      type: actions.FETCH_INVENTORY_SUCCESS,
      payload: {
        data: data?.results ?? [],
        total: data.count,
        firstPage: !data.previous,
      },
    });
  } catch (error) {
    notification.error(error);

    yield put({
      type: actions.FETCH_INVENTORY_FAILURE,
      payload: {
        error,
      },
    });
  }
}

export function* callCreateInventoryItem({ payload }) {
  try {
    const { data } = yield call(createInventoryItem, payload);
    // TODO: refactor for inventory item response
    yield put({
      type: actions.CREATE_INVENTORY_ITEM_SUCCESS,
      payload: {
        data: data?.results ?? [],
        total: data.count,
        firstPage: !data.previous,
      },
    });
  } catch (error) {
    notification.error({
      message: 'Something went wrong',
    });

    yield put({
      type: actions.CREATE_INVENTORY_ITEM_FAILURE,
      payload: {
        error,
      },
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_INVENTORY_REQUEST, callFetchInventory),
    takeEvery(actions.CREATE_INVENTORY_ITEM_REQUEST, callCreateInventoryItem),
  ]);
}
