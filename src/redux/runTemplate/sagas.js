import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { createTemplate } from 'services/runTemplate';
import actions from './actions';

export function* callCreateTemplate({ payload }) {
  const {
    method,
    runNumber,
    kfpParam,
    replicationParam,
    poolRacks,
    qsMachine,
    runType,
    startColumn,
  } = payload;

  try {
    yield call(createTemplate, {
      method,
      replication: replicationParam,
      kfp: kfpParam,
      start_column: startColumn,
      run_number: runNumber,
      run_type: runType,
      qs_machine: qsMachine,
      scans_ids: poolRacks
        .map((poolRack) => poolRack.id)
        .filter((item) => typeof item === 'string'),
    });

    yield put({ type: actions.CREATE_TEMPLATE_SUCCESS });

    notification.success({
      message: 'Template generated',
    });
  } catch (error) {
    yield put({ type: actions.CREATE_TEMPLATE_FAILURE });

    notification.error({
      message: error.message ?? 'Template not generated',
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CREATE_TEMPLATE_REQUEST, callCreateTemplate)]);
}
