import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['create'], 'run', 'template'),
};

export default actions;
