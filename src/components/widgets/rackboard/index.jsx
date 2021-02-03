import React from 'react';
import { Table, Button, Popover, Input, Row, Col } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/**
 * estimated statuses:
 * 1 Not Tested
 * 2 Missing Tube
 * 3 Failed
 * 4 Tested
 * 5 Positive Control
 * 6 Negative Control
 * 7 Empty
 * 8 Pooling Tube
 *
 */

const Rackboard = ({ rackboard }) => {
  const restColumns = [...Array(8).keys()].map(i => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => {
      // console.log('record', record);
      return (
        <Popover
          content={
            <>
              <Input
                size="large"
                placeholder="Tube barcode"
                value={record?.[`col${i + 1}`]?.tube_id}
                // onPressEnter={}
                className={classNames(styles.tubeInput, 'text-right mb-4')}
              />
              <Button className="d-block w-100 mb-3">Delete</Button>
              <Button className="d-block w-100 mb-3" type="primary">
                Invalidate
              </Button>
              <Button className="d-block w-100 mb-3">Cancel</Button>
              <Button className="d-block w-100" type="primary">
                Save
              </Button>
            </>
          }
          trigger="click"
        >
          <Button
            type="primary"
            shape="circle"
            className={classNames(styles.tube, {
              [styles.notTested]:
                record[`col${i + 1}`]?.status === 'not tested',
            })}
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
