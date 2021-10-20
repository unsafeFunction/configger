export const values = {
  SalivaClear: 'SalivaClear',
  SalivaDirect: 'SalivaDirect',
  oneKFP: '1_KINGFISHER_PLATE',
  twoKFPs: '2_KINGFISHER_PLATE',
  duplicate: 'DUPLICATE',
  triplicate: 'TRIPLICATE',
};

export const startColumns = (start = 1, end = 23) => {
  const arr = [];
  let i = start % 2 ? start : (start += 1);
  while (i <= end) {
    arr.push({
      label: i,
      value: i,
    });
    i += 2;
  }
  return arr;
};

export const runTypes = [
  {
    label: 'Pools',
    value: 'Pools',
  },
  {
    label: 'Reflex',
    value: 'Reflex',
  },
  {
    label: 'Validation',
    value: 'Validation',
  },
  {
    label: 'R&D',
    value: 'R&D',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const qsMachines = [
  {
    label: 'QS1',
    value: 'QS1',
  },
  {
    label: 'QS2',
    value: 'QS2',
  },
  {
    label: 'QS3',
    value: 'QS3',
  },
];
