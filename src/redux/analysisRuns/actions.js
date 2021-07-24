import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'analysisRuns', 'runs'),
  ...generateRequestActions(['upload'], 'analysisRuns', 'run_result'),
  ...generateRequestActions(['fetch'], 'analysisRuns', 'run'),
  ...generateRequestActions(['update'], 'analysisRuns', 'sample'),
  ...generateRequestActions(['update'], 'analysisRuns', 'run'),
};

export default actions;
