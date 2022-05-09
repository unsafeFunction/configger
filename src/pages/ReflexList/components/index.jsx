import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
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

export default ReflexStatus;
