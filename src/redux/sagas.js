import { all } from 'redux-saga/effects';
import analysisRuns from './analysisRuns/sagas';
import companies from './companies/sagas';
import helpers from './helpers/sagas';
import intakeReceiptLog from './intakeReceiptLog/sagas';
import intakeDashboard from './intakeDashboard/sagas';
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
import enviroments from './enviroments/sagas';

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    runs(),
    companies(),
    pools(),
    search(),
    intakeReceiptLog(),
    intakeDashboard(),
    scan(),
    inventory(),
    racks(),
    runTemplate(),
    analysisRuns(),
    scanners(),
    helpers(),
    timeline(),
    enviroments(),
    reflex(),
  ]);
}
