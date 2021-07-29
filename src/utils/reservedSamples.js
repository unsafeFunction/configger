const isReserved = (value = '') => {
  const reservedSamples = ['H20', 'H2O', 'HBSS', 'PC', 'BLANKS', 'EMPTY'];

  return reservedSamples.some((sample) => value.includes(sample));
};

export default isReserved;
