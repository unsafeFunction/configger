import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/runs/actions';
import { Table, DatePicker, Spin, Switch, Popconfirm } from 'antd';
import moment from 'moment-timezone';
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
          ? { from, to, limit: constants?.runs?.itemsLoadingCount }
          : { limit: constants?.runs?.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_RUNS_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dispatch, dates, history]);
  };

  useFetching();

  const columns = [
    {
      title: 'Companies',
      dataIndex: 'companies',
      render: (text, record) => (
        <Link to={`/runs/${record.unique_id}`}>{text}</Link>
      ),
    },
    {
      title: 'Pools Published',
      dataIndex: 'pools_published',
      width: 100,
    },
    {
      title: 'Pools Unpublished',
      dataIndex: 'pools_unpublished',
      width: 100,
    },
    {
      title: 'Results Timestamp',
      dataIndex: 'date',
      width: 150,
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title={`Sure to ${
            record.pools_unpublished === 0 ? 'unpublished' : 'published'
          }?`}
          onConfirm={() =>
            onPublishChange(record.unique_id, !(record.pools_unpublished === 0))
          }
          placement="topRight"
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.pools_unpublished === 0}
            loading={record.isUpdating}
          />
        </Popconfirm>
      ),
    },
  ];

  const data = runs.items.map(run => ({
    ...run,
    key: run.unique_id,
    companies: run.companies
      .reduce((accumulator, currentValue) => {
        if (currentValue?.name) {
          accumulator.push(currentValue.name.trim());
        }
        return accumulator;
      }, [])
      .join(', '),
    date: moment(run.results_timestamp).format('YYYY-MM-DD HH:mm'),
  }));

  const onDatesChange = useCallback((dates, dateStrings) => {
    if (dates) {
      history.push({ search: `?from=${dateStrings[0]}&to=${dateStrings[1]}` });
      setDates(dateStrings);
    } else {
      history.push({ search: '' });
      setDates([]);
    }
  }, []);

  const onPublishChange = useCallback(
    (runId, checked) => {
      dispatch({
        type: actions.PUBLISH_RUN_REQUEST,
        payload: {
          runId,
          isPublished: checked,
        },
      });
    },
    [dispatch],
  );

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            from,
            to,
            limit: constants?.runs?.itemsLoadingCount,
            offset: runs.offset,
          }
        : { limit: constants?.runs?.itemsLoadingCount, offset: runs.offset };
    dispatch({
      type: actions.FETCH_RUNS_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, runs]);

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
