import omit from 'lodash.omit';
import { SingleItemType } from 'redux/analysisRuns/reducers';
import { constants } from 'utils/constants';

export const isReservedSample = (value: string): boolean => {
  if (!value) {
    return false;
  }

  return constants.reservedSamples.some((sample) => value.includes(sample));
};

export const excludeReservedSamples = (items: SingleItemType[]) =>
  items.map?.((item) => {
    if (isReservedSample(item.display_sample_id)) {
      return omit(item, ['children', 'rerun_action']);
    }
    return item;
  });
