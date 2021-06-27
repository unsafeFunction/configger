import filter from 'lodash.filter';
import { constants } from 'utils/constants';

export const countedPoolTubes = filter(constants.tubes, 'countedForPool');

export const emptyPositionsArr = (positionsArr = [], tube = {}) => {
  if (!constants.tubes.incorrectLetters.includes(tube?.position?.[0])) {
    if (tube?.status === constants.tubes.deleted.status) {
      return [...positionsArr, tube?.position];
    }
    return positionsArr.filter((position) => position !== tube?.position);
  }

  return positionsArr;
};

export const incorrectPositionsArr = (positionsArr = [], tube = {}) => {
  if (
    constants.tubes.incorrectLetters.includes(tube?.position?.[0]) &&
    constants.tubes.referenceTubePosition !== tube?.position
  ) {
    if (tube?.status === constants.tubes.deleted.status) {
      return positionsArr.filter((position) => position !== tube?.position);
    }
    return [...positionsArr, tube?.position];
  }

  return positionsArr;
};
