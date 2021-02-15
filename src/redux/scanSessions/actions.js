import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'sessions', 'scan_sessions'),
  ...generateRequestActions(['fetch'], 'sessions', 'scan_session_by_id'),
  ...generateRequestActions(['update'], 'sessions', 'session'),
  ...generateRequestActions(['fetch', 'update'], 'scan', 'scan_by_id'),
  ...generateRequestActions(['update'], 'scan', 'tube'),
  ...generateRequestActions(['delete'], 'scan', 'tube'),
};

export default actions;

console.log(actions);
