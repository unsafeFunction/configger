import { DatePicker, Popconfirm, Spin, Switch, Table, Tooltip } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/runs/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const Runs = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

  const user = useSelector((state) => state.user);
  const runs = useSelector((state) => state.runs);

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
        <Tooltip title={record?.import_filename} placement="right">
          <Link to={`/runs/${record.id}`} className="text-blue">
            {text}
          </Link>
        </Tooltip>
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
            onPublishChange(record.id, !(record.pools_unpublished === 0))
          }
          placement="topRight"
          disabled={user.role === 'staff'}
        >
          <Switch
            checkedChildren="Published"
            unCheckedChildren="Unpublished"
            checked={record.pools_unpublished === 0}
            loading={record.isUpdating}
            disabled={user.role === 'staff'}
          />
        </Popconfirm>
      ),
    },
  ];

  const data = runs?.items?.map?.((run) => ({
    ...run,
    key: run.id,
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
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={runs.items.length < runs.total}
        loader={
          // eslint-disable-next-line react/jsx-wrap-multilines
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
          title={() => (
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
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              onChange={onDatesChange}
              className={styles.rangePicker}
            />
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export default Runs;
