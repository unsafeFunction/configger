import generateRequestActions from 'redux/factories/generateRequestActions';
import tubeActions from 'redux/scanSessions/actions';

const actions = {
  ...generateRequestActions(['fetch'], 'rack', 'racks'),
  ...generateRequestActions(['get', 'update'], 'rack', 'rack'),
  ...tubeActions,
  RACK_DATA_CHANGE: 'rack/RACK_DATA_CHANGE',
};

export default actions;
