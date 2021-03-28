import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'intakeReceiptLog', 'intake_log'),
  ...generateRequestActions(['create', 'patch'], 'intakeReceiptLog', 'intake'),
};

export default actions;
