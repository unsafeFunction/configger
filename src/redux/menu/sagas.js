import { all, put, call, select } from 'redux-saga/effects';
import getMenuData from 'services/menu';
import getRole from './selecotrs';

export function* GET_DATA() {
  const menuData = yield call(getMenuData);
  const role = yield select(getRole);

  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuData,
    },
  });
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ]);
}
