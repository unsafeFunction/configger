import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'scanners', 'scanners'),
};

export default actions;
