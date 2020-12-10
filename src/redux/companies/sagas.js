import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  loadCampaigns,
  deleteCampaign,
  createCampaign,
  startCampaign,
  // getSingleCampaign,
  getStatistics,
} from 'services/campaign';
import {
  fetchCompanies,
  getSingleCompany,
  createCompany,
} from 'services/companies';
import { notification } from 'antd';
import { getCampaign } from './selectors';
import actions from './actions';
import modalActions from '../modal/actions';

export function* callFetchCompanies({ payload }) {
  try {
    const response = yield call(fetchCompanies, payload);

    yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
        firstPage: !response.data.previous,
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

export function* callCreateCompany({ payload }) {
  try {
    const response = yield call(createCompany, payload);
    yield put({
      type: actions.CREATE_COMPANY_SUCCESS,
      payload: response,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Create company',
      description: 'You have successfully created company!',
    });
  } catch (error) {
    const errorData = error.response.data.field_errors;
    yield put({
      type: actions.CREATE_COMPANY_FAILURE,
      payload: {
        data: errorData,
      },
    });
    notification.error({
      message: 'Failure!',
      description: `Company not created.`,
    });
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

export function* callGetCompany({ payload }) {
  try {
    const response = yield call(getSingleCompany, payload.id);

    yield put({
      type: actions.GET_COMPANY_SUCCESS,
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
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callFetchCompanies),
    takeEvery(actions.REMOVE_CAMPAIGN_REQUEST, callRemoveCampaign),
    takeEvery(actions.CREATE_COMPANY_REQUEST, callCreateCompany),
    takeEvery(actions.START_CAMPAIGN_REQUEST, callStartCampaign),
    takeEvery(actions.GET_COMPANY_REQUEST, callGetCompany),
    takeEvery(actions.GET_CAMPAIGN_STATISTICS_REQUEST, callLoadStatistics),
  ]);
}
