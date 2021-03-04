import { all, takeEvery, put, call } from 'redux-saga/effects';
import { fetchInventory } from 'services/inventory';
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
  console.log('here');
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_INVENTORY_REQUEST, callFetchInventory)]);
}
