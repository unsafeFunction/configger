import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'sessions', 'scan_sessions'),
  ...generateRequestActions(['fetch'], 'sessions', 'scan_session_by_id'),
  ...generateRequestActions(['update'], 'sessions', 'session'),
  ...generateRequestActions(['fetch', 'update', 'void'], 'scan', 'scan_by_id'),
  ...generateRequestActions(['update', 'invalidate'], 'scan', 'tube'),
  ...generateRequestActions(['delete'], 'scan', 'tube'),
  ...generateRequestActions(['update'], 'scan', 'selected_code'),
  ...generateRequestActions(['fetch'], 'scan', 'session_id'),
};

export default actions;
