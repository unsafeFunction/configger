import { Col, Row, Table, Tag } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import poolRackActions from 'redux/racks/actions';

const PoolRack = ({ poolRackId }) => {
  const dispatch = useDispatch();

  const poolRack = useSelector((state) => state.racks.singleRack);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: poolRackActions.GET_RACK_REQUEST,
        payload: poolRackId,
      });
    }, []);
  };

  useFetching();

  const columns = [
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Tube ID',
      dataIndex: 'tube_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => {
        return <Tag color="blue">{text}</Tag>;
      },
    },
  ];

  return (
    <>
      <Row gutter={[40, 56]} justify="center">
        <Col xs={24} lg={12}>
          {/* <Typography.Title level={5}>
            PoolRack ID: ER00009784
          </Typography.Title>
          <Typography.Title level={5}>Test Tubes: 3 </Typography.Title> */}
          <ScanStatistic isRack scan={poolRack} />
          <Rackboard isRack rackboard={poolRack} scanId={poolRack.id} />
        </Col>
        <Col xs={24} lg={12}>
          <Table
            columns={columns}
            dataSource={poolRack.pools}
            loading={poolRack.isLoading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            bordered
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>
    </>
  );
};

PoolRack.propTypes = {
  poolRackId: PropTypes.string.isRequired,
};

export default PoolRack;
