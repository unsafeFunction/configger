import { all, takeEvery, put } from 'redux-saga/effects';
import { notification } from 'antd';
import actions from './actions';
import { constants } from 'utils/constants';

export function* callFetchSamples({}) {
  try {
    // const rackboard = [
    //   { A1: { tube_id: 'SN12345678', status: 'sample-tube--scs' } },
    //   { A2: { tube_id: 'SN12345678', status: 'sample-tube--scs' } },
    //   { F8: { tube_id: 'SN12345678', status: 'pooling-tube' } },
    // ];
    const rackboard = [...Array(6).keys()].map(i => ({
      letter: String.fromCharCode(constants?.A + i),
      col1: { tube_id: 'SN12345678', status: 'sample-tube--scs' },
      col2: { tube_id: null, status: 'sample-tube--err' },
      col3: { tube_id: null, status: 'sample-tube--upd' },
      col4: { tube_id: null, status: 'positive-control-tube' },
      col5: { tube_id: null, status: 'negative-control-tube' },
      col6: { tube_id: null, status: 'empty' },
      col7: { tube_id: null, status: 'empty' },
      col8: { tube_id: null, status: 'pooling-tube' },
    }));

    const response = {
      data: {
        results: rackboard,
      },
    };

    // const preparedData = response.data?.results?.map(position => {});
    // console.log('PREPARED DATA', preparedData);

    yield put({
      type: actions.FETCH_SAMPLES_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_SAMPLES_REQUEST, callFetchSamples)]);
}
