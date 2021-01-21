/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/intakeLims/actions';
import { Table, DatePicker, Spin } from 'antd';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const Runs = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

  const intakeList = useSelector(state => state.intakeLims);

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
        type: actions.FETCH_INTAKE_REQUEST,
        payload: {
          ...params,
        },
      });
    }, [dispatch, dates, history]);
  };

  useFetching();

  const columns = [
    {
      title: 'Date',
      dataIndex: 'ship_date',
      width: 100,
    },
    {
      title: 'Company name',
      dataIndex: 'company_name',
      width: 100,
    },
    {
      title: 'Ship By',
      dataIndex: 'shipping_by',
      width: 100,
    },
    {
      title: 'Company ID',
      dataIndex: 'company_id',
      width: 50,
    },
    {
      title: 'Pools',
      dataIndex: 'pool_count',
      width: 50,
    },
    {
      title: 'Samples',
      dataIndex: 'sample_count',
      width: 50,
    },
  ];

  const data = intakeList?.items?.map?.(intakeItem => ({
    ...intakeItem,
    key: intakeItem.company_id,
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

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
          from,
          to,
          limit: constants?.runs?.itemsLoadingCount,
          offset: intakeList.offset,
        }
        : {
          limit: constants?.runs?.itemsLoadingCount,
          offset: intakeList.offset,
        };
    dispatch({
      type: actions.FETCH_INTAKE_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, intakeList]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Intake</h4>
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={intakeList.items.length < intakeList.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={intakeList.items.length}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={intakeList.isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
        />
      </InfiniteScroll>
    </>
  );
};

export default Runs;
