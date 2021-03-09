import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import modalActions from 'redux/modal/actions';
import PropTypes from 'prop-types';
import { Row, Col, Table, Spin, Typography, Tag, Button, Input } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getColor, getIcon } from 'utils/highlightingResult';
import styles from './styles.module.scss';

const { Text } = Typography;

const PoolRackTable = ({ loadMore }) => {
  const dispatch = useDispatch();

  const poolRacks = useSelector(state => state.racks.racks);

  const columns = [
    {
      title: 'PoolRack Name',
      dataIndex: '',
    },
    {
      title: 'PoolRack RackID',
      dataIndex: 'rack_id',
    },
    {
      title: 'Pool Count',
      dataIndex: 'scan_pools_count',
    },
    {
      title: 'Scanned By',
      dataIndex: '',
    },
    {
      title: 'Actions',
      render: (_, record) => <Button type="link">View plate</Button>,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  return (
    <>
      <Row gutter={[0, 24]} justify="end">
        <Col xs={24} md={12}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            // value={searchName}
            // onChange={onChangeSearch}
          />
        </Col>
      </Row>

      <InfiniteScroll
        next={loadMore}
        hasMore={poolRacks.items.length < poolRacks.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={poolRacks.items.length}
        height="70vh"
      >
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={poolRacks.items}
          // loading={poolRacks.isLoading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          rowKey={record => record.id}
        />
      </InfiniteScroll>
    </>
  );
};

PoolRackTable.propTypes = {
  loadMore: PropTypes.func.isRequired,
};

export default PoolRackTable;
