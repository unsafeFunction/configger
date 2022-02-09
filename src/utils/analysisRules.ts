import round from 'lodash.round';
import omit from 'lodash.omit';
import { constants } from 'utils/constants';
import { SingleItemType } from 'redux/analysisRuns/reducers';

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

export const excludeReservedSamples = (items: SingleItemType[]) =>
  items.map?.((item) => {
    if (isReservedSample(item.display_sample_id)) {
      return omit(item, ['children', 'rerun_action']);
    }
    return item;
  });
