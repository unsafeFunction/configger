import { Col, Row, Table, Tag, Typography } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import poolRackActions from 'redux/racks/actions';

const { Text } = Typography;

const PoolRackDetail = ({ id }) => {
  const dispatch = useDispatch();

  const [highlightedTube, setTube] = useState('');
  console.log('highlightedTube', highlightedTube);

  const poolRack = useSelector((state) => state.racks.singleRack);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: poolRackActions.GET_RACK_REQUEST,
        payload: id,
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
          <Rackboard
            isRack
            rackboard={poolRack}
            scanId={poolRack.id}
            editMode={false}
            highlightedTube
          />
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
            onRow={(record, rowIndex) => {
              return {
                onMouseEnter: (event) => {
                  setTube(record.position);
                },
              };
            }}
          />
        </Col>
      </Row>
    </>
  );
};

PoolRackDetail.propTypes = {
  id: PropTypes.string.isRequired,
};

export default PoolRackDetail;
