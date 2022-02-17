import { Col, Row, Table, Tag } from 'antd';
import Rackboard from 'components/widgets/Rackboard';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rowCounter } from 'utils/tableFeatures';
import poolRackActions from 'redux/racks/actions';

const PoolRackDetail = ({ id }) => {
  const dispatch = useDispatch();

  const [highlightedTubeId, setTube] = useState(null);

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
    rowCounter,
    {
      title: 'Position',
      dataIndex: 'position',
      width: 70,
    },
    {
      title: 'Tube ID',
      dataIndex: 'tube_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        return <Tag color="blue">{value}</Tag>;
      },
    },
    {
      title: 'Company Short',
      dataIndex: 'company_short',
    },
    {
      title: 'Pool Name',
      dataIndex: 'pool_name',
    },
  ];

  return (
    <>
      <Row gutter={[40, 56]}>
        <Col xs={24} lg={12}>
          <Rackboard
            isRack
            rackboard={poolRack}
            scanId={poolRack.id}
            editMode={false}
            highlightedTubeId={highlightedTubeId}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Table
            columns={columns}
            dataSource={poolRack.tubes}
            loading={poolRack.isLoading}
            pagination={false}
            scroll={{ x: 550, y: '60vh' }}
            rowKey={(record) => record.id}
            onRow={(record) => {
              return {
                onMouseEnter: () => {
                  setTube(record.id);
                },
                onMouseLeave: () => {
                  setTube(null);
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
