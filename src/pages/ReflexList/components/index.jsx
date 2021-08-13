/* eslint-disable react/jsx-one-expression-per-line */
import { Space, Tooltip, Typography } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { roundValue } from 'utils/analysisRules';
import styles from './styles.module.scss';

const { Text } = Typography;

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
    width: 200,
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
    width: 100,
  },
  {
    title: 'Sample ID',
    dataIndex: 'sample_id',
    width: 120,
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
    title: 'Rack ID',
    dataIndex: 'rack_id',
  },
  {
    title: 'Pool Run',
    dataIndex: 'pool_run_title',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (value, record) => {
      return (
        <Tooltip
          placement="right"
          title={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Space direction="vertical" className={styles.tooltip}>
              <Text>PoolRack ID: {record.pool_rack_id ?? '–'}</Text>
              <Text>PoolRack: {record.pool_rack ?? '–'}</Text>
              <Text>Position: {record.position ?? '–'}</Text>
            </Space>
          }
        >
          {value}
        </Tooltip>
      );
    },
  },
  {
    title: 'Reflex Run',
    dataIndex: 'reflex_run_title',
  },
];

export const expandedColumns = [
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
    width: 312,
  },
  {
    title: 'Tube ID',
    dataIndex: 'tube_id',
    width: 120,
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
    title: 'N gene',
    dataIndex: 'N gene',
    render: (_, record) => {
      return <Target record={record} field="N gene" />;
    },
  },
  {
    title: 'S gene',
    dataIndex: 'S gene',
    render: (_, record) => {
      return <Target record={record} field="S gene" />;
    },
  },
  {
    title: 'Orf1ab',
    dataIndex: 'ORF1ab',
    render: (_, record) => {
      return <Target record={record} field="ORF1ab" />;
    },
  },
  {
    title: 'RP',
    dataIndex: 'RP',
    render: (_, record) => {
      return <Target record={record} field="RP" />;
    },
  },
];
