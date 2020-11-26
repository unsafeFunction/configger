import { all, takeEvery, put, call } from 'redux-saga/effects';
import { loadTimeline, downloadFile } from 'services/timeline';
import { notification } from 'antd';
import actions from './actions';

export function* callLoadTimeline({ payload }) {
  try {
    const response = yield call(loadTimeline, payload);
    yield put({
      type: actions.LOAD_TIMELINE_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callDownloadFile({ payload }) {
  try {
    yield call(downloadFile, payload);
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.LOAD_TIMELINE_REQUEST, callLoadTimeline)]);
  yield all([takeEvery(actions.DOWNLOAD_REQUEST, callDownloadFile)]);
}
