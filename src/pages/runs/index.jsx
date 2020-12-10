import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/runs/actions';
import ProfileInfo from '../profileInfo';
import Password from '../password';
import { Table, Button, DatePicker, Spin, Switch, Popconfirm } from 'antd';
import moment from 'moment-timezone';
import { PlusCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation, Link } from 'react-router-dom';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import { constants } from 'utils/constants';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const Runs = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

  const runs = useSelector(state => state.runs);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? { from, to, limit: constants.runs.itemsLoadingCount }
          : { limit: constants.runs.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dates, history]);
  };

  useFetching();

  const columns = [
    {
      title: 'Companies',
      dataIndex: 'companies',
      key: 'companies',
      render: (text, record) => <Link to={`/runs/${record.key}`}>{text}</Link>,
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

  const data = runs.items.map(run => ({
    key: run.unique_id,
    isUpdating: run.isUpdating,
    companies: run.companies
      .reduce((accumulator, currentValue) => {
        if (currentValue.name !== '') {
          accumulator.push(currentValue.name.trim());
        }
        return accumulator;
      }, [])
      .join(', '),
    published: run.pools_published,
    unpublished: run.pools_unpublished,
    date: moment(run.results_timestamp).format('YYYY-MM-DD HH:mm'),
    // date: moment(run.results_timestamp).format('MMM. D, YYYY h:mm a'),
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

  const onPublishChange = useCallback((runId, checked) => {
    // console.log(`switch to ${checked}`, runId);
    dispatch({
      type: actions.PUBLISH_RUN_REQUEST,
      payload: {
        runId: runId,
        isPublished: checked,
      },
    });
  }, []);

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            from,
            to,
            limit: constants.runs.itemsLoadingCount,
            offset: runs.offset,
          }
        : { limit: constants.runs.itemsLoadingCount, offset: runs.offset };
    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, runs]);

  // console.log('runs', runs);
  // console.log('data', data);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Runs</h4>
        <RangePicker
          defaultValue={
            from && to
              ? [moment(from), moment(to)]
              : [moment().subtract(7, 'days'), moment()]
          }
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
        hasMore={runs.items.length < runs.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={runs.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={runs.isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
        />
      </InfiniteScroll>
    </>
  );
};

export default Runs;
