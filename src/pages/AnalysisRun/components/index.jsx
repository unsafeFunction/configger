import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Checkbox, Popconfirm, Tooltip } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/analysisRuns/actions';

const TargetValue = ({ record, value, warning }) => {
  return record[warning] ? (
    <Tooltip placement="right" title={record[warning]}>
      {value}
      <ExclamationCircleTwoTone twoToneColor="orange" className="ml-1" />
    </Tooltip>
  ) : (
    <>{value}</>
  );
};

TargetValue.propTypes = {
  record: PropTypes.shape({}).isRequired,
  warning: PropTypes.string.isRequired,
};

const PoolCheckbox = ({ record, dataIndex, value, title }) => {
  const dispatch = useDispatch();

  const onPoolUpdate = useCallback(
    (id, param, value) => {
      dispatch({
        type: actions.UPDATE_POOL_REQUEST,
        payload: {
          id,
          param,
          value,
        },
      });
    },
    [dispatch],
  );

  return (
    <Popconfirm
      title={`Are you sure you would like to ${
        value ? 'unset' : 'set'
      } ${title} for ${record.pool_name} pool?`}
      onConfirm={() => onPoolUpdate(record.id, dataIndex, !value)}
      placement="topRight"
    >
      {record.children && (
        <Checkbox checked={value} disabled={record.isUpdating} />
      )}
    </Popconfirm>
  );
};

PoolCheckbox.propTypes = {
  record: PropTypes.shape({}).isRequired,
  dataIndex: PropTypes.string.isRequired,
  value: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

const poolStatuses = [
  {
    text: 'Detected',
    value: 'Detected',
  },
  {
    text: 'Inconclusive',
    value: 'Inconclusive',
  },
  {
    text: 'Invalid',
    value: 'Invalid',
  },
  {
    text: 'Not Detected',
    value: 'Not Detected',
  },
];

const columns = [
  {
    title: 'Company Short',
    dataIndex: 'company_short',
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
  },
  {
    title: 'Sample ID',
    dataIndex: 'sample_id',
  },
  {
    title: 'Result',
    dataIndex: 'status',
    render: (_, record) => {
      return {
        children: record?.status ? (
          <ResultTag status={record.status} type="pool" />
        ) : null,
      };
    },
    filters: poolStatuses,
    onFilter: (value, record) => record.status.indexOf(value) === 0,
  },
  {
    title: 'Wells',
    dataIndex: 'wells',
  },
  {
    title: 'MS2',
    dataIndex: 'ms2',
    width: 75,
    render: (value, record) => {
      return <TargetValue record={record} value={value} warning="ms2_msg" />;
    },
  },
  {
    title: 'N gene',
    dataIndex: 'n_gene',
    width: 75,
    render: (value, record) => {
      return <TargetValue record={record} value={value} warning="n_gene_msg" />;
    },
  },
  {
    title: 'S gene',
    dataIndex: 's_gene',
    width: 75,
    render: (value, record) => {
      return <TargetValue record={record} value={value} warning="s_gene_msg" />;
    },
  },
  {
    title: 'Orf1ab',
    dataIndex: 'orf1ab',
    width: 75,
    render: (value, record) => {
      return <TargetValue record={record} value={value} warning="orf1ab_msg" />;
    },
  },
  {
    title: 'RP',
    dataIndex: 'rp',
    width: 75,
    render: (value, record) => {
      return <TargetValue record={record} value={value} warning="rp_msg" />;
    },
  },
  {
    title: 'Reflex SC',
    dataIndex: 'reflex_sc',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          dataIndex="reflex_sc"
          value={value}
          title="Reflex SC"
        />
      );
    },
  },
  {
    title: 'Reflex SD',
    dataIndex: 'reflex_sd',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          dataIndex="reflex_sd"
          value={value}
          title="Reflex SD"
        />
      );
    },
  },
  {
    title: 'Rerun',
    dataIndex: 'rerun',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          dataIndex="rerun"
          value={value}
          title="Rerun"
        />
      );
    },
  },
];

export default columns;
