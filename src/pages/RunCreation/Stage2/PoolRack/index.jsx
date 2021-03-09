import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/runCreation/actions';
import poolRackActions from 'redux/racks/actions';
import modalActions from 'redux/modal/actions';
import { Row, Col, Table, Typography, Tag, Button } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import Rackboard from 'components/widgets/Rackboard';
import styles from './styles.module.scss';

const { Text } = Typography;

const PoolRack = ({ poolRackId }) => {
  const dispatch = useDispatch();

  const poolRack = useSelector(state => state.racks.singleRack);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: poolRackActions.GET_RACK_REQUEST,
        payload: poolRackId,
      });
    }, []);
  };

  useFetching();

  // const columns = [
  //   {
  //     title: 'Receiving Date & Time',
  //     dataIndex: 'date',
  //   },
  //   {
  //     title: 'Rack ID',
  //     dataIndex: 'rack_id',
  //   },
  //   {
  //     title: 'Index',
  //     dataIndex: 'index',
  //   },
  //   {
  //     title: 'Position',
  //     dataIndex: 'position',
  //   },
  //   {
  //     title: 'Tube ID',
  //     dataIndex: 'tube_id',
  //   },
  //   {
  //     title: 'Error Code',
  //     dataIndex: 'error_code',
  //   },
  //   {
  //     title: 'Error',
  //     dataIndex: 'error',
  //   },
  // ];

  // const data = rack?.items?.map?.((position, index) => ({
  //   key: index,
  //   ...position,
  // }));

  return (
    <>
      <Row gutter={[40, 56]} justify="center">
        <Col xs={24} lg={12}>
          <Typography.Title level={5}>
            Pool Rack ID: ER00009784
          </Typography.Title>
          <Typography.Title level={5}>Test Tubes: 3 </Typography.Title>
          <Rackboard isRack rackboard={poolRack} scanId={poolRack.id} />
        </Col>
        <Col xs={24} lg={12}>
          {/* <Table
            columns={columns}
            dataSource={data}
            loading={rack.isLoading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            bordered
          /> */}
        </Col>
      </Row>
    </>
  );
};

export default PoolRack;
