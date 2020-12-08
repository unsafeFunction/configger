import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
// import ProfileInfo from '../profileInfo';
// import Password from '../password';
import { Table, Button, DatePicker, Spin, Switch, Popconfirm } from 'antd';
import moment from 'moment-timezone';
import is from 'is_js';
import { PlusCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
// import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import { result } from 'lodash';

moment.tz.setDefault('America/New_York');

// const { RangePicker } = DatePicker;

const batchesPage = {
  defaultLoadingNumber: 20,
  initialLoadingNumber: 40,
};

const Pools = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const location = useLocation();
  // const [dates, setDates] = useState([]);
  // const [loadingCount, setLoadingCount] = useState(
  //   batchesPage.initialLoadingNumber,
  // );

  const pools = useSelector(state => state.pools);

  // const { from, to } = qs.parse(location.search, {
  //   ignoreQueryPrefix: true,
  // });
  // console.log('from to 11111', from, to);

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
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
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
          onConfirm={() => onPublishChange(record.key, !record.isPublished)}
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
    isPublished: pool.is_published,
    id: pool.pool_id,
    title: pool.title,
    size: pool.pool_size,
    tubes: 'some list',
    result: pool.result,
    company: pool.company.name_short,
  }));

  // const onDatesChange = useCallback((dates, dateStrings) => {
  //   // console.log('dates', dates);
  //   // console.log('dateStrings', dateStrings);

  //   if (dates) {
  //     history.push({ search: `?from=${dateStrings[0]}&to=${dateStrings[1]}` });
  //     setDates(dateStrings);
  //   } else {
  //     history.push({ search: '' });
  //     setDates([]);
  //   }
  // }, []);

  const onPublishChange = useCallback((poolId, checked) => {
    // console.log(`switch to ${checked}`, batchId);
    dispatch({
      type: actions.PUBLISH_POOL_REQUEST,
      payload: {
        poolId: poolId,
        isPublished: checked,
      },
    });
  }, []);

  // const loadMore = useCallback(() => {
  //   const params =
  //     from && to
  //       ? { from: from, to: to, limit: loadingCount }
  //       : { limit: loadingCount };
  //   dispatch({
  //     type: actions.FETCH_BATCHES_REQUEST,
  //     payload: {
  //       ...params,
  //     },
  //   });
  //   setLoadingCount(loadingCount + batchesPage.defaultLoadingNumber);
  // }, [loadingCount, from, to]);

  // console.log('batches', batches);
  // console.log('data', data);

  return (
    <>
      {/* <InfiniteScroll
        next={loadMore}
        hasMore={batches.items.length < batches.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={batches.items.length}
      > */}
      <Table
        columns={columns}
        dataSource={data}
        loading={pools.isLoading}
        pagination={false}
        scroll={{ x: 1000 }}
      />
      {/* </InfiniteScroll> */}
    </>
  );
};

export default Pools;
