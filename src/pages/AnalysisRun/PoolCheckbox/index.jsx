import { Checkbox, Popconfirm } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/analysisRuns/actions';

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

export default PoolCheckbox;
