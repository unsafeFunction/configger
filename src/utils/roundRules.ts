import round from 'lodash.round';

export const roundValueToSecondNumber = (value: number): number | null => {
  if (value) {
    return round(value, 2);
  }
  return null;
};
