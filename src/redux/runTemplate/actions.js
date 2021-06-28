import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['create'], 'templateGeneration', 'template'),
};

export default actions;
