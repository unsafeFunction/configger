import sessionActions from 'redux/scanSessions/actions';

const actions = {
  SHOW_DRAWER: 'drawer/SHOW_DRAWER',
  HIDE_DRAWER: 'drawer/HIDE_DRAWER',
  SET_ERROR: 'drawer/SET_ERROR',
  ...sessionActions,
};

export default actions;
