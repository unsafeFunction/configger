import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { createRun, createTemplate } from 'services/templateGeneration';
import actions from './actions';

export function* callCreateTemplate({ payload }) {
  try {
    const response = yield call(createRun, payload);

    const { id, is_reflexed, is_reruned, title } = response?.data;

    yield call(createTemplate, {
      runId: id,
      reflex: is_reflexed,
      rerun: is_reruned,
      name: title,
      contentType: 'text/csv',
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
