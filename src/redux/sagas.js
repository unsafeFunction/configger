import { all } from 'redux-saga/effects';
import analysisRuns from './analysisRuns/sagas';
import companies from './companies/sagas';
import intake from './intake/sagas';
import intakeLims from './intakeLims/sagas';
import intakeReceiptLog from './intakeReceiptLog/sagas';
import inventory from './inventory/sagas';
import management from './management/sagas';
import menu from './menu/sagas';
import pools from './pools/sagas';
import racks from './racks/sagas';
import runs from './runs/sagas';
import scanners from './scanners/sagas';
import scan from './scanSessions/sagas';
import search from './search/sagas';
import settings from './settings/sagas';
import templateGeneration from './templateGeneration/sagas';
import user from './user/sagas';
import helpers from './helpers/sagas';

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    runs(),
    companies(),
    pools(),
    intake(),
    search(),
    intakeLims(),
    intakeReceiptLog(),
    scan(),
    management(),
    inventory(),
    racks(),
    templateGeneration(),
    analysisRuns(),
    scanners(),
    helpers(),
  ]);
}
