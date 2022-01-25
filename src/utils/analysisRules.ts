import round from 'lodash.round';

export const isReservedSample = (value: string): boolean => {
  if (!value) {
    throw Error('value is required');
  }

  const reservedSamples = ['H20', 'H2O', 'HBSS', 'PC', 'BLANKS', 'EMPTY'];

  return reservedSamples.some((sample) => value.includes(sample));
};

export const roundValue = (value: number): number | null => {
  if (value && value) {
    return round(value, 2);
  }
  return null;
};
