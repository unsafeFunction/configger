import { all, put, call } from 'redux-saga/effects';
import { getMenuData, getRolePermissions } from 'services/menu';

export function* GET_DATA() {
  const menuData = yield call(getMenuData);
  const rolePermissions = yield call(getRolePermissions);

  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuData,
      rolePermissions,
    },
  });
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ]);
}
