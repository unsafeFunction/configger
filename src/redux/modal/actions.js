import intakeReceiptLogActions from 'redux/intakeReceiptLog/actions';
import sessionActions from 'redux/scanSessions/actions';

const actions = {
  SHOW_MODAL: 'modal/SHOW_MODAL',
  HIDE_MODAL: 'modal/HIDE_MODAL',
  SET_ERROR: 'modal/SET_ERROR',
  ...intakeReceiptLogActions,
  ...sessionActions,
};

export default actions;
