import { all, takeEvery, put, call } from 'redux-saga/effects';
import {
  getSingleCompany,
  createCompany,
  updateUsers,
} from 'services/companies';
import { notification } from 'antd';
import actions from './actions';
import modalActions from '../modal/actions';

export function* callFetchInventory({ payload }) {
  console.log('here');
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_INVENTORY_REQUEST, callFetchInventory)]);
}
