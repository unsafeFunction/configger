import round from 'lodash.round';

export const isReservedSample = (value = '') => {
  const reservedSamples = ['H20', 'H2O', 'HBSS', 'PC', 'BLANKS', 'EMPTY'];

  return reservedSamples.some((sample) => value.includes(sample));
};

export const roundValue = (value) => {
  // eslint-disable-next-line no-restricted-globals
  if (value && !isNaN(value)) {
    return round(value, 2);
  }
  return null;
};
