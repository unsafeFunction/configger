import round from 'lodash.round';
import { constants } from 'utils/constants';

export const isReservedSample = (value: string): boolean => {
  if (!value) {
    throw Error('value is required');
  }

  return constants.reservedSamples.some((sample) => value.includes(sample));
};

export const roundValue = (value: number): number | null => {
  if (value && value) {
    return round(value, 2);
  }
  return null;
};
