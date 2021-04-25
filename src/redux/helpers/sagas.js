import { notification } from 'antd';
import { all, call, takeEvery } from 'redux-saga/effects';
import { downloadFile } from 'services/helpersRequests';
import actions from './actions';

export function* callExportFile({ payload }) {
  try {
    yield call(downloadFile, payload);
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.EXPORT_FILE_REQUEST, callExportFile)]);
}
