import { all } from 'redux-saga/effects';
import user from './user/sagas';
import menu from './menu/sagas';
import settings from './settings/sagas';
import campaigns from './campaigns/sagas';
import recipients from './recipients/sagas';
import messages from './messages/sagas';
import companies from './companies/sagas';
import runs from './runs/sagas';
import timeline from './timeline/sagas';
import pools from './pools/sagas';

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    campaigns(),
    recipients(),
    messages(),
    runs(),
    timeline(),
    companies(),
    pools(),
  ]);
}
