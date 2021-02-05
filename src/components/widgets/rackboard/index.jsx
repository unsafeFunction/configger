import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import { Table, Button, Popover, Input, Popconfirm } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const Rackboard = ({ rackboard }) => {
  const dispatch = useDispatch();

  const handleSave = useCallback(
    record => {
      console.log('save', record);

      dispatch({
        type: actions.UPDATE_TUBE_REQUEST,
        payload: record,
      });
    },
    [dispatch],
  );

  const restColumns = [...Array(8).keys()].map(i => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      // console.log('record', record);
      return (
        <Popover
          // disabled={record[`col${i + 1}`]?.status !== 'empty'}
          content={
            <>
              <Input
                size="large"
                placeholder="Tube barcode"
                value={record?.[`col${i + 1}`]?.tube_id}
                // onPressEnter={}
                className={classNames(styles.tubeInput, 'text-right mb-4')}
              />

              <Popconfirm
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleSave(record?.[`col${i + 1}`])}
              >
                <Button className="d-block w-100 mb-3" type="primary">
                  Save
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
                // onConfirm={} //TODO: send tube_id=""
              >
                <Button className="d-block w-100 mb-3" danger>
                  Delete
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
                // onConfirm={}
              >
                <Button className="d-block w-100 mb-3">Invalidate</Button>
              </Popconfirm>

              <Button className="d-block w-100">Cancel</Button>
            </>
          }
          trigger="click"
        >
          <Button
            type="primary"
            shape="circle"
            className={styles.tube}
            style={
              record[`col${i + 1}`]?.status !== 'empty'
                ? {
                    background: record[`col${i + 1}`]?.color,
                    borderColor: record[`col${i + 1}`]?.color,
                  }
                : null
            }
            ghost={
              !record[`col${i + 1}`] ||
              record[`col${i + 1}`]?.status === 'empty'
            }
          />
        </Popover>
      );
    },
  }));

  const columns = [
    {
      dataIndex: 'letter',
      align: 'center',
      fixed: true,
      className: styles.letterColumn,
    },
    ...restColumns,
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={rackboard?.items}
        loading={rackboard?.isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        rowKey={record => record.letter}
        size="small"
      />
    </>
  );
};

Rackboard.propTypes = {
  rackboard: PropTypes.object,
};

export default Rackboard;
