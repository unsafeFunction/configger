import React from 'react';
import { Table, Button, Popover, Input, Row, Col } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/**
 * this component will be used not only in Scan
 * pls, make it reusable
 *
 * estimated rack position statuses:
 *  empty
 *  sample-tube--scs
 *  sample-tube--err
 *  sample-tube--upd
 *  positive-control-tube
 *  negative-control-tube
 *  pooling-tube
 *
 */

const Rackboard = ({ rackboard }) => {
  const restColumns = [...Array(8).keys()].map(i => ({
    title: `${i + 1}`,
    dataIndex: `col${i + 1}`,
    align: 'center',
    render: (_, record) => (
      <Popover
        content={
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Input
                  size="large"
                  placeholder="Tube barcode"
                  value={record[`col${i + 1}`].tube_id}
                  // onPressEnter={}
                  className="text-right"
                />
              </Col>
              <Col xs={12}>
                <Button className="w-100">Delete</Button>
              </Col>
              <Col xs={12}>
                <Button className="w-100" type="primary">
                  Invalidate
                </Button>
              </Col>
              <Col xs={12}>
                <Button className="w-100">Cancel</Button>
              </Col>
              <Col xs={12}>
                <Button className="w-100" type="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </>
        }
        trigger="click"
      >
        <Button
          type="primary"
          shape="circle"
          className={classNames(styles.tube, {
            // [styles.tubeScs]: record[`col${i + 1}`].status === 'sample-tube--scs',
            [styles.tubeErr]:
              record[`col${i + 1}`].status === 'sample-tube--err',
            [styles.tubeUpd]:
              record[`col${i + 1}`].status === 'sample-tube--upd',
            [styles.tubePosControl]:
              record[`col${i + 1}`].status === 'positive-control-tube',
            [styles.tubeNegControl]:
              record[`col${i + 1}`].status === 'negative-control-tube',
            [styles.poolingTube]:
              record[`col${i + 1}`].status === 'pooling-tube',
          })}
          ghost={record[`col${i + 1}`].status === 'empty'}
        />
      </Popover>
    ),
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
