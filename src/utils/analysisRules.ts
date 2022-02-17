import { constants } from 'utils/constants';

export const isReservedSample = (value: string): boolean => {
  if (!value) {
    throw Error('value is required');
  }

  return constants.reservedSamples.some((sample) => value.includes(sample));
};
