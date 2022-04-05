export const rowCounter = {
  title: '№',
  render: (_: any, __: any, index: number) => {
    return index + 1;
  },
  fixed: 'left' as 'left',
  width: 40,
};
