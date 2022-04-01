import ResultTag from 'components/widgets/ResultTag';
import React from 'react';
import { roundValueToSecondNumber } from 'utils/roundRules';
import { rowCounter } from 'utils/tableFeatures';
import { constants } from 'utils/constants';

const { targets, tubeTypes } = constants;

export const getTargetColumns = (method) => {
  return targets[method ?? 'all'].map((target) => {
    return {
      title: target,
      dataIndex: target,
      width: 100,
      render: (_, record) => {
        const mean = roundValueToSecondNumber(record?.mean?.[target]);
        const standardDeviation =
          roundValueToSecondNumber(record?.standard_deviation?.[target]) ??
          'NA';
        return mean ? `${mean} (${standardDeviation})` : null;
      },
    };
  });
};

const columns = [
  rowCounter,
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
    filters: Object.values(tubeTypes).map((value) => ({ text: value, value })),
    onFilter: (value, record) => record.tube_type.indexOf(value) === 0,
    width: 110,
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
  {
    title: 'Run',
    dataIndex: 'run',
  },
];

export default columns;
