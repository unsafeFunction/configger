const states = ['REQUEST', 'SUCCESS', 'FAILURE'];

const generateRequestActions = (
  instance,
  requestTypes = ['CREATE', 'UPDATE', 'DELETE', 'FETCH'],
) => {
  const actions = {};
  const methodsArray = requestTypes.map(type => ({
    type,
    states,
  }));

  methodsArray.forEach(method => {
    method.states.forEach(state => {
      Object.assign(actions, {
        [`${
          method.type
        }_${instance.toUpperCase()}_${state}`]: `${instance.toLowerCase()}/${
          method.type
        }_${instance.toUpperCase()}_${state}`,
      });
    });
  });

  return actions;
};

export default generateRequestActions;
