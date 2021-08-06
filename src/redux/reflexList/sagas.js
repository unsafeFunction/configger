import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchReflexList } from 'services/reflexList';
import actions from './actions';

export function* callLoadReflexList({ payload }) {
  try {
    const response = yield call(fetchReflexList, payload);

    yield put({
      type: actions.FETCH_REFLEX_LIST_SUCCESS,
      payload: {
        data: response.data,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_REFLEX_LIST_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_REFLEX_LIST_REQUEST, callLoadReflexList)]);
}
