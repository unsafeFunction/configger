import { all } from 'redux-saga/effects';
import menu from './menu/sagas';
import settings from './settings/sagas';
import user from './user/sagas';
import enviroments from './enviroments/sagas';
import projects from './projects/sagas';

export default function* rootSaga() {
  yield all([user(), menu(), settings(), enviroments(), projects()]);
}
