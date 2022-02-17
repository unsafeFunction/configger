import generateRequestActions from 'redux/factories/generateRequestActions';
import { ActionType } from './types';

const actions: ActionType = {
  ...generateRequestActions(['fetch'], 'analysisRuns', 'runs'),
  ...generateRequestActions(['upload'], 'analysisRuns', 'run_result'),
  ...generateRequestActions(['fetch'], 'analysisRuns', 'run'),
  ...generateRequestActions(['update'], 'analysisRuns', 'sample'),
  ...generateRequestActions(['update'], 'analysisRuns', 'run'),
  ...generateRequestActions(['fetch'], 'analysisRuns', 'wellplate'),
};

export default actions;
