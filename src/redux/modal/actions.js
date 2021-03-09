import intakeReceiptLogActions from 'redux/intakeReceiptLog/actions';

const actions = {
  SHOW_MODAL: 'modal/SHOW_MODAL',
  HIDE_MODAL: 'modal/HIDE_MODAL',
  SET_ERROR: 'modal/SET_ERROR',
  ...intakeReceiptLogActions,
};

export default actions;
