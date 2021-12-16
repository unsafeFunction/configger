import ResultTag from 'components/widgets/ResultTag';
import React from 'react';
import { roundValue } from 'utils/analysisRules';
import { constants } from 'utils/constants';

const targetColumns = constants.targets.map((target) => {
  return {
    title: target,
    dataIndex: target,
    width: 100,
    render: (_, record) => {
      const mean = roundValue(record?.mean?.[target]);
      const standardDeviation =
        roundValue(record?.standard_deviation?.[target]) ?? 'NA';
      return mean ? `${mean} (${standardDeviation})` : null;
    },
  };
});

const columns = [
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
  },
  {
    title: 'Tube ID',
    dataIndex: 'tube_id',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    width: 150,
    render: (value) => {
      return <ResultTag status={value} type="sample" />;
    },
  },
  ...targetColumns,
  {
    title: 'Run',
    dataIndex: 'run',
  },
];

export default columns;
