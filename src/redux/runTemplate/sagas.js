import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { createRun, createTemplate } from 'services/runTemplate';
import actions from './actions';

export function* callCreateTemplate({ payload }) {
  const {
    method,
    runNumber,
    kfpParam,
    replicationParam,
    poolRacks,
    reflex,
    rerun,
  } = payload;

  try {
    const response = yield call(createRun, {
      title: runNumber,
      type: kfpParam,
      option: replicationParam,
      scans_ids: poolRacks
        .map((poolRack) => poolRack.id)
        .filter((item) => typeof item === 'string'),
      is_reflexed: reflex,
      is_reruned: rerun,
    });

    const { id, is_reflexed, is_reruned, title } = response?.data;

    yield call(createTemplate, {
      runId: id,
      reflex: is_reflexed,
      rerun: is_reruned,
      name: title,
      contentType: 'application/zip',
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
