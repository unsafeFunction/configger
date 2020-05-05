import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  loadRecipients,
  //   deleteCampaign,
  createRecipient,
} from 'services/recipients';
import { notification } from 'antd';
import { getRecipient } from './selectors';
import actions from './actions';

export function* callLoadRecipients({ payload }) {
  try {
    const response = yield call(loadRecipients, payload);

    yield put({
      type: actions.LOAD_RECIPIENTS_SUCCESS,
      payload: {
        data: response.data,
        total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

// export function* callRemoveRecipient({ payload }) {
//   try {
//     const response = yield call(deleteCampaign, payload.id);

//     yield put({
//       type: actions.REMOVE_CAMPAIGN_SUCCESS,
//       payload: {
//         ...response,
//         id: payload.id,
//       },
//     });
//     yield call(notification.success, 'Success');
//   } catch (error) {
//     notification.error({});
//   }
// }

export function* callCreateRecipient({ payload }) {
  try {
    const data = yield select(getRecipient);
    console.log(data);
    const response = yield call(createRecipient, {
      ...data,
      campaignId: payload.campaignId,
    });
    console.log(response);
    yield put({
      type: actions.CREATE_CAMPAIGN_SUCCESS,
      payload: response,
    });
    yield call(notification.success, 'Successfully create campaign');
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_RECIPIENTS_REQUEST, callLoadRecipients),
    // takeEvery(actions.REMOVE_RECIPIENT_REQUEST, callRemoveRecipient),
    takeEvery(actions.CREATE_RECIPIENT_REQUEST, callCreateRecipient),
  ]);
}
