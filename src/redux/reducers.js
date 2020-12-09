import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import user from './user/reducers';
import menu from './menu/reducers';
import settings from './settings/reducers';
import campaigns from './campaigns/reducers';
import recipients from './recipients/reducers';
import messages from './messages/reducers';
import modal from './modal/reducers';
import companies from './companies/reducers';
import runs from './runs/reducers';
import timeline from './timeline/reducers';
import pools from './pools/reducers';

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    campaigns,
    modal,
    recipients,
    messages,
    companies,
    runs,
    timeline,
    pools,
  });
