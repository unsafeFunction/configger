import { all } from 'redux-saga/effects';
import analysisRuns from './analysisRuns/sagas';
import companies from './companies/sagas';
import helpers from './helpers/sagas';
import intake from './intake/sagas';
import intakeLims from './intakeLims/sagas';
import intakeReceiptLog from './intakeReceiptLog/sagas';
import inventory from './inventory/sagas';
import menu from './menu/sagas';
import pools from './pools/sagas';
import racks from './racks/sagas';
import reflex from './reflex/sagas';
import runs from './runs/sagas';
import runTemplate from './runTemplate/sagas';
import scanners from './scanners/sagas';
import scan from './scanSessions/sagas';
import search from './search/sagas';
import settings from './settings/sagas';
import timeline from './timeline/sagas';
import user from './user/sagas';

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
    inventory(),
    racks(),
    runTemplate(),
    analysisRuns(),
    scanners(),
    helpers(),
    timeline(),
    reflex(),
  ]);
}
