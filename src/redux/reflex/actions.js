import generateRequestActions from 'redux/factories/generateRequestActions';

const actions = {
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_list'),
  ...generateRequestActions(['fetch'], 'reflex', 'reflex_comparison'),
  ...generateRequestActions(['update'], 'reflex', 'reflex_sample'),
  ...generateRequestActions(['delete'], 'reflex', 'reflex_item'),
};

export default actions;
