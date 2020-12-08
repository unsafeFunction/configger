import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/batches/actions';
import ProfileInfo from '../profileInfo';
import Password from '../password';
import { Table, Button, DatePicker, Spin, Switch, Popconfirm } from 'antd';
import moment from 'moment-timezone';
import is from 'is_js';
import { PlusCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation, Link } from 'react-router-dom';
import qs from 'qs';
// import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const batchesPage = {
  defaultLoadingNumber: 20,
  initialLoadingNumber: 40,
};

const Batches = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);
  const [loadingCount, setLoadingCount] = useState(
    batchesPage.initialLoadingNumber,
  );

  const batches = useSelector(state => state.batches);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  // console.log('from to 11111', from, to);

  // const useFetching = () => {
  useEffect(() => {
    const params =
      from && to
        ? { from: from, to: to, limit: batchesPage.defaultLoadingNumber }
        : { limit: batchesPage.defaultLoadingNumber };
    // console.log('params', params);
    dispatch({
      type: actions.FETCH_BATCHES_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dates, history]);
  // };

  // useFetching();

  const columns = [
    {
      title: 'Companies',
      dataIndex: 'companies',
      key: 'companies',
      render: (text, record) => (
        <Link to={`/batches/${record.key}`}>{text}</Link>
      ),
    },
    {
      title: 'Pools Published',
      dataIndex: 'published',
      key: 'published',
      width: 100,
    },
    {
      title: 'Pools Unpublished',
      dataIndex: 'unpublished',
      key: 'unpublished',
      width: 100,
    },
    {
      title: 'Results Timestamp',
      dataIndex: 'date',
      key: 'date',
      // width: 170,
      width: 150,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (text, record) => (
        // data.length >= 1 ? (
        <Popconfirm
          title={`Sure to ${
            record.unpublished === 0 ? 'unpublished' : 'published'
          }?`}
          onConfirm={() =>
            onPublishChange(record.key, !(record.unpublished === 0))
          }
          placement="topRight"
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.unpublished === 0}
            loading={record.isUpdating}
          />
        </Popconfirm>
      ),
      // ) : null,
    },
  ];

  const data = batches.items.map(batch => ({
    key: batch.unique_id,
    isUpdating: batch.isUpdating,
    companies: batch.companies
      .reduce((accumulator, currentValue) => {
        if (is.not.empty(currentValue.name)) {
          accumulator.push(currentValue.name.trim());
        }
        return accumulator;
      }, [])
      .join(', '),
    published: batch.pools_published,
    unpublished: batch.pools_unpublished,
    date: moment(batch.results_timestamp).format('YYYY-MM-DD HH:mm'),
    // date: moment(batch.results_timestamp).format('MMM. D, YYYY h:mm a'),
  }));

  const onDatesChange = useCallback((dates, dateStrings) => {
    // console.log('dates', dates);
    // console.log('dateStrings', dateStrings);

    if (dates) {
      history.push({ search: `?from=${dateStrings[0]}&to=${dateStrings[1]}` });
      setDates(dateStrings);
    } else {
      history.push({ search: '' });
      setDates([]);
    }
  }, []);

  const onPublishChange = useCallback((batchId, checked) => {
    // console.log(`switch to ${checked}`, batchId);
    dispatch({
      type: actions.PUBLISH_BATCH_REQUEST,
      payload: {
        batchId: batchId,
        isPublished: checked,
      },
    });
  }, []);

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? { from: from, to: to, limit: loadingCount }
        : { limit: loadingCount };
    dispatch({
      type: actions.FETCH_BATCHES_REQUEST,
      payload: {
        ...params,
      },
    });
    setLoadingCount(loadingCount + batchesPage.defaultLoadingNumber);
  }, [loadingCount, from, to]);

  // console.log('batches', batches);
  // console.log('data', data);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Batches</h4>
        <RangePicker
          defaultValue={from && to ? [moment(from), moment(to)] : null}
          format="YYYY-MM-DD"
          // format="MMM. D, YYYY"
          ranges={{
            Today: [moment(), moment()],
            'Last 7 Days': [moment().subtract(7, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          onChange={onDatesChange}
        />
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={batches.items.length < batches.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={batches.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={batches.isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </InfiniteScroll>
    </>
  );
};

export default Batches;
