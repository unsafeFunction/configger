import { constants } from 'utils/constants';

// export const rackboard = [...Array(6).keys()].map(i => ({
//   letter: String.fromCharCode(constants?.A + i),
//   col1: { tube_id: 'SN12345678', status: 'sample-tube--scs' },
//   col2: { tube_id: null, status: 'sample-tube--err' },
//   col3: { tube_id: null, status: 'sample-tube--upd' },
//   col4: { tube_id: null, status: 'positive-control-tube' },
//   col5: { tube_id: null, status: 'negative-control-tube' },
//   col6: { tube_id: null, status: 'empty' },
//   col7: { tube_id: null, status: 'empty' },
//   col8: { tube_id: null, status: 'pooling-tube' },
// }));

export const rackboard = [
  {
    letter: 'D',
    col1: { tube_id: null, status: 'empty' },
    col2: { tube_id: null, status: 'empty' },
    col3: { tube_id: null, status: 'empty' },
    col4: { tube_id: null, status: 'empty' },
    col5: { tube_id: null, status: 'empty' },
    col6: { tube_id: null, status: 'empty' },
    col7: { tube_id: null, status: 'empty' },
    col8: { tube_id: null, status: 'empty' },
  },
  {
    letter: 'E',
    col1: { tube_id: null, status: 'empty' },
    col2: { tube_id: null, status: 'empty' },
    col3: { tube_id: null, status: 'empty' },
    col4: { tube_id: null, status: 'empty' },
    col5: { tube_id: null, status: 'empty' },
    col6: { tube_id: null, status: 'empty' },
    col7: { tube_id: null, status: 'empty' },
    col8: { tube_id: null, status: 'empty' },
  },
  {
    letter: 'F',
    col1: { tube_id: null, status: 'empty' },
    col2: { tube_id: null, status: 'empty' },
    col3: { tube_id: null, status: 'empty' },
    col4: { tube_id: null, status: 'empty' },
    col5: { tube_id: null, status: 'empty' },
    col6: { tube_id: null, status: 'empty' },
    col7: { tube_id: null, status: 'empty' },
    col8: { tube_id: null, status: 'pooling-tube' },
  },
];
