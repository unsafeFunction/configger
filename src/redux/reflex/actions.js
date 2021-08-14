import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_list'),
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_details'),
};

export default actions;
