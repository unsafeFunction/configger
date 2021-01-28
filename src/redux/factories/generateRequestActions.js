const states = ['REQUEST', 'SUCCESS', 'FAILURE'];

const generateRequestActions = (
  requestTypes = ['CREATE', 'UPDATE', 'DELETE', 'FETCH'],
  instance,
  actionName = instance,
) => {
  const actions = {};
  const methodsArray = requestTypes.map(type => ({
    type,
    states,
  }));

  methodsArray.forEach(method => {
    method.states.forEach(state => {
      const singleAction = `${method.type.toUpperCase()}_${(method.type.toUpperCase() ===
      'FETCH'
        ? `${actionName}s`
        : actionName
      ).toUpperCase()}_${state}`;

      Object.assign(actions, {
        [singleAction]: `${instance.toLowerCase()}/${singleAction}`,
      });
    });
  });

  return actions;
};

export default generateRequestActions;
