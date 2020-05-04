import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { loadCampaigns, deleteCampaign, createCampaign } from 'services/campaign'
import { notification } from 'antd'
import { getCampaign } from './selectors'
import actions from './actions'

export function* callLoadCampaigns() {
  try {
    const response = yield call(loadCampaigns, 1)

    yield put({
      type: actions.LOAD_CAMPAIGN_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    notification.error({})
  }
}

export function* callRemoveCampaign({ payload }) {
  try {
    const response = yield call(deleteCampaign, payload.id)

    yield put({
      type: actions.REMOVE_CAMPAIGN_SUCCESS,
      payload: {
        ...response,
        id: payload.id,
      },
    })
    yield call(notification.success, 'Success')
  } catch (error) {
    notification.error({})
  }
}

export function* callCreateCampaign() {
  try {
    const data = yield select(getCampaign)
    const response = yield call(createCampaign, data)

    yield put({
      type: actions.CREATE_CAMPAIGN_SUCCESS,
      payload: response,
    })
    yield call(notification.success, 'Successfully create campaign')
  } catch (error) {
    notification.error(error)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CAMPAIGN_REQUEST, callLoadCampaigns),
    takeEvery(actions.REMOVE_CAMPAIGN_REQUEST, callRemoveCampaign),
    takeEvery(actions.CREATE_CAMPAIGN_REQUEST, callCreateCampaign),
  ])
}
