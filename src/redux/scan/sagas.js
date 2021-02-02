import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import actions from './actions';
import { fetchCompanies, fetchSamples } from 'services/scan';
import { constants } from 'utils/constants';
import { rackboard } from './data';

export function* callFetchSamples({}) {
  try {
    // const response = {
    //   data: {
    //     results: rackboard,
    //   },
    // };

    const response = yield call(fetchSamples);
    console.log(response);

    yield put({
      type: actions.FETCH_SAMPLES_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    console.log(error);
    notification.error(error);
  }
}

export function* callFetchCompanies({ payload }) {
  try {
    const response = yield call(fetchCompanies, payload);

    yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
      payload: {
        data: response.data,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_SAMPLES_REQUEST, callFetchSamples),
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callFetchCompanies),
  ]);
}
