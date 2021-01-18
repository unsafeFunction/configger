import { all } from 'redux-saga/effects';
import user from './user/sagas';
import menu from './menu/sagas';
import settings from './settings/sagas';
import companies from './companies/sagas';
import runs from './runs/sagas';
import timeline from './timeline/sagas';
import pools from './pools/sagas';
import hijack from './hijack/sagas';
import activityStream from './activityStream/sagas';
import intake from './intake/sagas';
import search from './search/sagas';
import intakeLims from './intakeLims/sagas';

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    runs(),
    timeline(),
    companies(),
    pools(),
    hijack(),
    activityStream(),
    intake(),
    search(),
    intakeLims(),
  ]);
}
