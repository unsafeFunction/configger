import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'scan', 'sample'),
  ...generateRequestActions(['fetch'], 'sessions', 'scan_session'),
};

export default actions;

console.log(actions);
