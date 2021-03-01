import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'rack', 'racks'),
  ...generateRequestActions(['get'], 'rack', 'rack'),
  RACK_DATA_CHANGE: 'rack/RACK_DATA_CHANGE',
};

export default actions;
