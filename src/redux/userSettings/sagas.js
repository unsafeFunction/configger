import { all, takeEvery, put } from 'redux-saga/effects';
import store from 'store';
import qs from 'qs';
import { history, store as reduxStore } from 'index';
import actions from './actions';

export default function* rootSaga() {
  yield all([
    // takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    // SETUP(), // run once on app load to init listeners
  ]);
}
