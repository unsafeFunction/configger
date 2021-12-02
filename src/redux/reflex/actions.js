import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_list'),
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_comparison'),
  ...generateRequestActions(['update'], 'reflex', 'reflex_sample'),
};

export default actions;
