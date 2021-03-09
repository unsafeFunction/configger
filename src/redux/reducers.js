import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import user from './user/reducers';
import menu from './menu/reducers';
import settings from './settings/reducers';
import modal from './modal/reducers';
import customers from './customers/reducers';
import companies from './companies/reducers';
import runs from './runs/reducers';
import timeline from './timeline/reducers';
import pools from './pools/reducers';
import hijack from './hijack/reducers';
import activityStream from './activityStream/reducers';
import intake from './intake/reducers';
import search from './search/reducers';
import intakeLims from './intakeLims/reducers';
import intakeReceiptLog from './intakeReceiptLog/reducers';
import scanSessions from './scanSessions/reducers';
import management from './management/reducers';
import racks from './racks/reducers';
import runCreation from './runCreation/reducers';

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    modal,
    customers,
    companies,
    runs,
    timeline,
    pools,
    hijack,
    activityStream,
    intake,
    search,
    intakeLims,
    intakeReceiptLog,
    scanSessions,
    management,
    racks,
    runCreation,
  });
