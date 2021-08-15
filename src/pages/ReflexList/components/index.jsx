import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/reflex/actions';

const ReflexStatus = ({ value, record }) => {
  const dispatch = useDispatch();

  const handleUpdate = useCallback(
    (id, value) => {
      dispatch({
        type: actions.UPDATE_SAMPLE_REQUEST,
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
      onConfirm={() => handleUpdate(record.sample_id, !value)}
      placement="topRight"
      // TODO: uncomment when API endpoint will be ready
      // disabled={value}
      disabled
    >
      <Switch
        checked={value}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        loading={record.isUpdating}
        // TODO: uncomment when API endpoint will be ready
        // disabled={value}
        disabled
      />
    </Popconfirm>
  );
};

ReflexStatus.propTypes = {
  value: PropTypes.bool.isRequired,
  record: PropTypes.shape({}).isRequired,
};

const columns = [
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
    // TODO: uncomment when API endpoint will be ready
    // render: (value) => (
    //   <Link to={`/reflex-list/${value}`} className="text-blue">
    //     {value}
    //   </Link>
    // ),
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
    render: (value, record) => <ReflexStatus value={value} record={record} />,
  },
  {
    title: 'Completed By',
    dataIndex: 'completed_by',
  },
];

export default columns;
