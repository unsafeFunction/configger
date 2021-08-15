import floor from 'lodash.floor';

export const isReservedSample = (value = '') => {
  const reservedSamples = ['H20', 'H2O', 'HBSS', 'PC'];

  return reservedSamples.some((sample) => value.includes(sample));
};

export const isUnusedSample = (value = '') => {
  const unusedSamples = ['BLANKS', 'EMPTY'];

  return unusedSamples.includes(value);
};

export const roundValue = (value) => {
  // eslint-disable-next-line no-restricted-globals
  if (value && !isNaN(value)) {
    return floor(value, 2);
  }
  return null;
};
