import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../redux/pools/actions';
import { Table, Button, Spin, Switch, Popconfirm, Popover, Select } from 'antd';
import moment from 'moment-timezone';
import { PlusCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import { result } from 'lodash';

// moment.tz.setDefault('America/New_York');

const { Option } = Select;

const PoolTable = ({ loadMore }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const pools = useSelector(state => state.pools);
  const resutList = useSelector(state => state.pools.resultList);

  const useFetching = () => {
    useEffect(() => {
      dispatch({ type: actions.FETCH_RESULT_LIST_REQUEST });
    }, []);
  };

  useFetching();

  const columns = [
    {
      title: 'Pool ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Pool Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Pool Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Tube IDs',
      dataIndex: 'tubes',
      key: 'tubes',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Popover
          content={record.tubes}
          title={`${record.id} tubes`}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {record.tubes}
        </Popover>
      ),
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      width: 182,
      render: (text, record) => (
        <Select
          defaultValue={record.result}
          style={{ width: 165 }}
          loading={record.resultIsUpdating}
          onChange={handleResultUpdate(record.key)}
        >
          {resutList.items.map(item => (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Results Timestamp',
      dataIndex: 'date',
      key: 'date',
      width: 180,
    },
    {
      title: 'Company',
      dataIndex: 'shortCompany',
      key: 'shortCompany',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Popover
          content={record.company}
          // title={`${record.id} tubes`}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="topLeft"
        >
          {record.shortCompany}
        </Popover>
      ),
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (text, record) => (
        // data.length >= 1 ? (
        <Popconfirm
          title={`Sure to ${record.isPublished ? 'unpublished' : 'published'}?`}
          onConfirm={() => handlePublish(record.key, !record.isPublished)}
          placement="topRight"
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.isPublished}
            loading={record.isUpdating}
          />
        </Popconfirm>
      ),
      // ) : null,
    },
  ];

  const data = pools.items.map(pool => ({
    key: pool.unique_id,
    isUpdating: pool.isUpdating,
    resultIsUpdating: pool.resultIsUpdating,
    isPublished: pool.is_published,
    id: pool.pool_id,
    title: pool.title,
    size: pool.pool_size,
    tubes: pool.tube_ids.join(', '),
    result: pool.result,
    date: pool.results_updated_on,
    company: pool.company.name,
    shortCompany: pool.company.name_short,
  }));

  const handlePublish = useCallback((poolId, checked) => {
    dispatch({
      type: actions.PUBLISH_POOL_REQUEST,
      payload: {
        poolId: poolId,
        isPublished: checked,
      },
    });
  }, []);

  const handleResultUpdate = useCallback(
    poolId => value => {
      // console.log(`selected ${value}`, poolId);
      dispatch({
        type: actions.UPDATE_POOL_RESULT_REQUEST,
        payload: {
          poolId: poolId,
          result: value,
        },
      });
    },
    [],
  );

  return (
    <>
      <InfiniteScroll
        next={loadMore}
        hasMore={pools.items.length < pools.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={pools.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={pools.isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
        />
      </InfiniteScroll>
    </>
  );
};

export default PoolTable;
