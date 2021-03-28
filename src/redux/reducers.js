import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import user from './user/reducers';
import menu from './menu/reducers';
import settings from './settings/reducers';
import userSettings from './userSettings/reducers';
import modal from './modal/reducers';
import companies from './companies/reducers';
import runs from './runs/reducers';
import pools from './pools/reducers';
import intake from './intake/reducers';
import search from './search/reducers';
import intakeLims from './intakeLims/reducers';
import intakeReceiptLog from './intakeReceiptLog/reducers';
import scanSessions from './scanSessions/reducers';
import management from './management/reducers';
import inventory from './inventory/reducers';
import racks from './racks/reducers';
import runCreation from './runCreation/reducers';
import analysisRuns from './analysisRuns/reducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    userSettings,
    modal,
    companies,
    runs,
    pools,
    intake,
    search,
    intakeLims,
    intakeReceiptLog,
    scanSessions,
    management,
    inventory,
    racks,
    runCreation,
    analysisRuns,
  });
