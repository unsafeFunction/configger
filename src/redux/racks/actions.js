import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'rack', 'racks'),
  ...generateRequestActions(['get'], 'rack', 'rack'),
};

export default actions;
