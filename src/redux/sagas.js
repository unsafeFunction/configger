import { all } from 'redux-saga/effects';
import user from './user/sagas';
import menu from './menu/sagas';
import settings from './settings/sagas';
import customers from './customers/sagas';
import companies from './companies/sagas';
import runs from './runs/sagas';
import timeline from './timeline/sagas';
import pools from './pools/sagas';
import hijack from './hijack/sagas';
import activityStream from './activityStream/sagas';
import intake from './intake/sagas';
import search from './search/sagas';
import intakeLims from './intakeLims/sagas';
import intakeReceiptLog from './intakeReceiptLog/sagas';
import scan from './scanSessions/sagas';
import management from './management/sagas';
import inventory from './inventory/sagas';
import racks from './racks/sagas';

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    runs(),
    timeline(),
    customers(),
    companies(),
    pools(),
    hijack(),
    activityStream(),
    intake(),
    search(),
    intakeLims(),
    intakeReceiptLog(),
    scan(),
    management(),
    inventory(),
    racks(),
  ]);
}
