import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import analysisRuns from './analysisRuns/reducers';
import companies from './companies/reducers';
import drawer from './drawer/reducers';
import helpersReducer from './helpers/reducers';
import intake from './intake/reducers';
import intakeLims from './intakeLims/reducers';
import intakeReceiptLog from './intakeReceiptLog/reducers';
import inventory from './inventory/reducers';
import menu from './menu/reducers';
import modal from './modal/reducers';
import pools from './pools/reducers';
import racks from './racks/reducers';
import reflex from './reflex/reducers';
import runs from './runs/reducers';
import runTemplate from './runTemplate/reducers';
import scanners from './scanners/reducers';
import scanSessions from './scanSessions/reducers';
import search from './search/reducers';
import settings from './settings/reducers';
import timeline from './timeline/reducers';
import user from './user/reducers';
import userSettings from './userSettings/reducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    userSettings,
    modal,
    drawer,
    companies,
    runs,
    pools,
    intake,
    search,
    intakeLims,
    intakeReceiptLog,
    scanSessions,
    inventory,
    racks,
    runTemplate,
    analysisRuns,
    scanners,
    helpersReducer,
    timeline,
    reflex,
  });
