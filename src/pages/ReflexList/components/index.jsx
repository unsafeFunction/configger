import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
import ActionInitiator from 'components/widgets/ActionInitiator';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import labConfig from 'utils/labConfig';
import { rowCounter } from 'utils/tableFeatures';

const ReflexStatus = ({ value, record }) => {
  const dispatch = useDispatch();

  const handleUpdate = useCallback(
    (id, value) => {
      dispatch({
        type: actions.UPDATE_REFLEX_SAMPLE_REQUEST,
        payload: {
          id,
          isCompleted: value,
        },
      });
    },
    [dispatch],
  );

  return (
    <Popconfirm
      title={`Are you sure you would like to ${
        value ? 'cancel' : 'set as completed'
      }?`}
      onConfirm={() => handleUpdate(record.id, !value)}
      placement="topRight"
      disabled={value}
    >
      <Switch
        checked={value}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        loading={record.isUpdating}
        disabled={value}
      />
    </Popconfirm>
  );
};

ReflexStatus.propTypes = {
  value: PropTypes.bool.isRequired,
  record: PropTypes.shape({}).isRequired,
};

const columns = [
  rowCounter,
  {
    title: 'Company Short',
    dataIndex: 'name_short',
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
  },
  {
    title: 'PoolScan Rack ID',
    dataIndex: 'poolrack_id',
  },
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
  },
  {
    title: 'Sample ID',
    dataIndex: 'sample_id',
    render: (value, record) => (
      <Link to={`/reflex-list/${record.id}`} className="table-link">
        {value}
      </Link>
    ),
  },
  {
    title: 'Result',
    dataIndex: 'analysis_result',
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
    title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Position`,
    dataIndex: 'rack_position',
  },
  {
    title: 'Rack ID',
    dataIndex: 'rack_id',
  },
  {
    title: 'Completed',
    dataIndex: 'completed',
    align: 'center',
    render: (value, record) => <ReflexStatus value={value} record={record} />,
  },
  {
    title: 'Completed By',
    dataIndex: 'completed_by',
    render: (value) => <ActionInitiator initiator={value} />,
  },
];

export default columns;
