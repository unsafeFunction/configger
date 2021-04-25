import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['export'], 'file', 'file'),
};

export default actions;
