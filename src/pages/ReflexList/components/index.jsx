import { Checkbox } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { roundValue } from 'utils/analysisRules';

const Target = ({ record, field }) => {
  const targetValue = () => {
    if (record?.mean) {
      const mean = roundValue(record?.mean?.[field]);
      const deviation = roundValue(record?.standard_deviation?.[field]) ?? 'NA';
      return mean ? `${mean} (${deviation})` : null;
    }
    return null;
  };

  return targetValue();
};

Target.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
};

export const columns = [
  {
    title: 'Company Short',
    dataIndex: 'company_short_name',
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
    width: 100,
  },
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
  },
  {
    title: 'Sample ID',
    dataIndex: 'sample_id',
  },
  {
    title: 'Result',
    dataIndex: 'analysis_result',
    width: 150,
    render: (value) => {
      return <ResultTag status={value} type="sample" />;
    },
  },
  {
    title: 'Pool Run',
    dataIndex: 'pool_run_title',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
  {
    title: 'PoolRack ID',
    dataIndex: 'poolrack_id',
  },
  {
    title: 'PoolRack Position',
    dataIndex: 'poolrack_position',
  },
  {
    title: 'Rack ID',
    dataIndex: 'rack_id',
  },
  {
    title: 'Completed',
    dataIndex: 'completed',
    align: 'center',
    width: 100,
    render: (value) => {
      return (
        <Checkbox
          value={value}
          // TODO: uncomment when API endpoint will be ready
          // disabled={value}
          disabled
        />
      );
    },
  },
  {
    title: 'Completed By',
    dataIndex: 'completed_by',
  },
];

export const comparisonColumns = [
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
    dataIndex: 'analysis_result',
    width: 150,
    render: (value) => {
      return <ResultTag status={value} type="sample" />;
    },
  },
  {
    title: 'MS2',
    dataIndex: 'MS2',
    width: 100,
    render: (_, record) => {
      return <Target record={record} field="MS2" />;
    },
  },
  {
    title: 'N gene',
    dataIndex: 'N gene',
    width: 100,
    render: (_, record) => {
      return <Target record={record} field="N gene" />;
    },
  },
  {
    title: 'S gene',
    dataIndex: 'S gene',
    width: 100,
    render: (_, record) => {
      return <Target record={record} field="S gene" />;
    },
  },
  {
    title: 'Orf1ab',
    dataIndex: 'ORF1ab',
    width: 100,
    render: (_, record) => {
      return <Target record={record} field="ORF1ab" />;
    },
  },
  {
    title: 'RP',
    dataIndex: 'RP',
    width: 100,
    render: (_, record) => {
      return <Target record={record} field="RP" />;
    },
  },
];
