import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import drawer from './drawer/reducers';
import menu from './menu/reducers';
import modal from './modal/reducers';
import settings from './settings/reducers';
import user from './user/reducers';
import userSettings from './userSettings/reducers';
import enviroments from './enviroments/reducers';
import projects from './projects/reducers';
import * as types from './storeTypes';

const rootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    userSettings,
    modal,
    drawer,
    enviroments,
    projects,
  });

export default rootReducer;
export type RootState = {
  user: types.UserState;
  settings: types.SettingState;
  pools: types.PoolState;
  enviroments: any;
};
