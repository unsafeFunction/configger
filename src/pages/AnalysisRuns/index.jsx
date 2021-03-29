import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Table, DatePicker } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/analysisRuns/actions';
import moment from 'moment-timezone';
import { constants } from 'utils/constants';
import qs from 'qs';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ScanSessions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dates, setDates] = useState([]);
  const location = useLocation();
  const stateRef = useRef();
  stateRef.current = dates;

  const runs = useSelector((state) => state.analysisRuns);

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
    }, [dispatch, from, to, history]);
  };

  useFetching();

  const runsItems = runs?.items;

  const columns = [
    {
      title: 'Run Title',
      dataIndex: 'title',
      render: (_, record) => (
        <Link to={`/analysis-runs/${record.id}`} className="text-blue">
          {record.title}
        </Link>
      ),
    },
    {
      title: 'Creation Date',
      dataIndex: 'date',
    },
    {
      title: 'Samples',
      dataIndex: 'scans_ids',
      render: (_, record) => {
        return record?.scans_ids?.length || '-';
      },
    },
    {
      title: `Status`,
      dataIndex: 'status',
    },
    {
      title: 'Last updated',
      dataIndex: 'last_updated',
    },
    {
      title: 'User',
      dataIndex: 'user',
    },
    {
      title: 'Reflex Run',
      dataIndex: 'reflexed',
      align: 'center',
      render: (_, record) =>
        record?.reflexed ? <CheckOutlined /> : <CloseOutlined />,
    },
    {
      title: 'Validation Run',
      dataIndex: 'validated',
      align: 'center',
      render: (_, record) =>
        record?.validated ? <CheckOutlined /> : <CloseOutlined />,
    },
  ];

  const onDatesChange = useCallback((dates, dateStrings) => {
    if (dates) {
      history.push({ search: `?from=${dateStrings[0]}&to=${dateStrings[1]}` });
      setDates(dateStrings);
    } else {
      history.push({ search: '' });
      setDates([]);
    }
  }, []);

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
        hasMore={runsItems.length < runs?.total}
        dataLength={runsItems?.length}
      >
        <Table
          dataSource={runsItems}
          columns={columns}
          scroll={{ x: 1000 }}
          bordered
          loading={runs?.isLoading}
          align="center"
          pagination={false}
          rowKey={(record) => record.id}
        />
      </InfiniteScroll>
    </>
  );
};

export default ScanSessions;
