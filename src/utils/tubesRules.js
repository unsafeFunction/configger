import { constants } from 'utils/constants';
import filter from 'lodash.filter';

export const countedPoolTubes = filter(constants.tubes, 'countedForPool');
