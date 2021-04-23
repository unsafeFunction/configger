import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'sessions', 'scan_sessions'),
  ...generateRequestActions(['fetch'], 'sessions', 'scan_session_by_id'),
  ...generateRequestActions(['fetch'], 'sessions', 'scan_session_by_id_short'),
  ...generateRequestActions(['update', 'create'], 'sessions', 'session'),
  ...generateRequestActions(
    ['fetch', 'update', 'void', 'cancel'],
    'scan',
    'scan_by_id',
  ),
  ...generateRequestActions(['update', 'invalidate'], 'scan', 'tube'),
  ...generateRequestActions(['delete'], 'scan', 'tube'),
  ...generateRequestActions(['update'], 'scan', 'selected_code'),
  ...generateRequestActions(['fetch'], 'scan', 'session_id'),
  ...generateRequestActions(['fetch'], 'session', 'company_info'),
  CHANGE_SESSION_DATA: 'session/CHANGE_SESSION_DATA',
  RESET_SCAN: 'scan/RESET_SCAN',
};

export default actions;
