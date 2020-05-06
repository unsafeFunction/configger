import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  loadCampaigns,
  deleteCampaign,
  createCampaign,
  startCampaign,
  getSingleCampaign,
  getStatistics,
} from 'services/campaign';
import { notification } from 'antd';
import { getCampaign } from './selectors';
import actions from './actions';

export function* callLoadCampaigns({ payload }) {
  try {
    const response = yield call(loadCampaigns, payload);

    yield put({
      type: actions.LOAD_CAMPAIGN_SUCCESS,
      payload: {
        data: response.data,
        total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callLoadStatistics({ payload }) {
  try {
    const response = yield call(getStatistics, payload.campaignId);

    yield put({
      type: actions.GET_CAMPAIGN_STATISTICS_SUCCESS,
      payload: {
        ...response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callRemoveCampaign({ payload }) {
  try {
    const response = yield call(deleteCampaign, payload.id);

    yield put({
      type: actions.REMOVE_CAMPAIGN_SUCCESS,
      payload: {
        ...response,
        id: payload.id,
      },
    });
    yield call(notification.success, 'Success');
  } catch (error) {
    notification.error({});
  }
}

export function* callCreateCampaign() {
  try {
    const data = yield select(getCampaign);
    const response = yield call(createCampaign, data);

    yield put({
      type: actions.CREATE_CAMPAIGN_SUCCESS,
      payload: response,
    });
    notification.success({
      message: 'Create campaign',
      description: 'You have successfully created campaign!',
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callStartCampaign() {
  try {
    const { id, startDateTime } = yield select(getCampaign);

    const response = yield call(startCampaign, {
      id,
      startDateTime,
    });
    yield put({
      type: actions.START_CAMPAIGN_SUCCESS,
      payload: response,
    });
    notification.success({
      message: 'Start campaign',
      description: 'You have successfully started campaign!',
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callGetCampaign({ payload }) {
  try {
    const response = yield call(getSingleCampaign, payload.id);

    yield put({
      type: actions.GET_CAMPAIGN_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CAMPAIGN_REQUEST, callLoadCampaigns),
    takeEvery(actions.REMOVE_CAMPAIGN_REQUEST, callRemoveCampaign),
    takeEvery(actions.CREATE_CAMPAIGN_REQUEST, callCreateCampaign),
    takeEvery(actions.START_CAMPAIGN_REQUEST, callStartCampaign),
    takeEvery(actions.GET_CAMPAIGN_REQUEST, callGetCampaign),
    takeEvery(actions.GET_CAMPAIGN_STATISTICS_REQUEST, callLoadStatistics),
  ]);
}
