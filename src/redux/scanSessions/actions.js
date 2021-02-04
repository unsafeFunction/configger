import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  FETCH_COMPANIES_REQUEST: 'scan/FETCH_COMPANIES_REQUEST',
  FETCH_COMPANIES_SUCCESS: 'scan/FETCH_COMPANIES_SUCCESS',
  FETCH_COMPANIES_FAILURE: 'scan/FETCH_COMPANIES_FAILURE',

  ...generateRequestActions(['fetch'], 'scan', 'sample'),
};

export default actions;
