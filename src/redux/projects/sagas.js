import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
// import { fetchEnviroments, createEnviroment } from 'services/evnviroments';
import { createProject } from 'services/projects';
import actions from './actions';

// export function* callFetchEnviroments() {
//   try {
//     const response = yield call(fetchEnviroments);
//     yield put({
//       type: actions.FETCH_ENVIROMENT_SUCCESS,
//       payload: {
//         data: response.data.results ?? [],
//       },
//     });
//   } catch (error) {
//     yield put({ type: actions.FETCH_ENVIROMENT_FAILURE });

//     notification.error({
//       message: error.message,
//     });
//   }
// }

export function* callCreateEnviroment({ payload }) {
  try {
    const response = yield call(createProject, payload);
    yield put({
      type: actions.CREATE_PROJECT_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    yield put({ type: actions.CREATE_PROJECT_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    // takeEvery(actions.FETCH_ENVIROMENT_REQUEST, callFetchEnviroments),
    takeEvery(actions.CREATE_PROJECT_REQUEST, callCreateEnviroment),
  ]);
}
