export const values = {
  SalivaClear: 'SalivaClear',
  SalivaDirect: 'SalivaDirect',
  Eurofins: 'Eurofins',
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
    label: 'Diagnostic',
    value: 'Diagnostic',
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

export const qsMachines = new Array(7).fill().map((_, index) => ({
  label: `QS${index + 1}`,
  value: `QS${index + 1}`,
}));
