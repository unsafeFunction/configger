import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(
    ['fetch'],
    'intakeDashboard',
    'daily_intake_counts',
  ),
};

export default actions;
