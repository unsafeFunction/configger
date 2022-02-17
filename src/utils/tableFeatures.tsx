import React from 'react';

export const rowCounter = {
  title: '№',
  render: (_: any, __: any, index: number) => {
    return <span style={{ color: '#90a4ae' }}>{index + 1}</span>;
  },
  fixed: 'left' as 'left',
  width: 40,
};
