export const isReserved = (value = '') => {
  const reservedSamples = ['H20', 'H2O', 'HBSS', 'PC'];

  return reservedSamples.some((sample) => value.includes(sample));
};

export const isUnused = (value = '') => {
  const unusedSamples = ['BLANKS', 'EMPTY'];

  return unusedSamples.includes(value);
};
