import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'inventory', 'inventory'),
  ...generateRequestActions(['create'], 'inventory', 'inventory_item'),
};

export default actions;
