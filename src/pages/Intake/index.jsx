/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
import { DatePicker, Table } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/intake/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const Runs = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

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
      dataIndex: 'date',
      width: 100,
      // render: (text, record) => <span>{momment(undefined)}</span>,
    },
    {
      title: 'Company name',
      dataIndex: 'company_name',
      width: 100,
    },
    {
      title: 'Company ID',
      dataIndex: 'company_id',
      width: 50,
    },
    {
      title: 'Pools',
      dataIndex: 'pool_size',
      width: 50,
    },
    {
      title: 'Samples',
      dataIndex: 'sample_size',
      width: 50,
    },
    {
      title: 'Tracking number',
      dataIndex: 'tracking_number',
      width: 50,
    },
    // {
    //   title: 'Action',
    //   fixed: 'right',
    //   width: 120,
    //   render: (_, record) => (
    //     <Popconfirm
    //       title={`Sure to ${
    //         record.pools_unpublished === 0 ? 'unpublished' : 'published'
    //       }?`}
    //       onConfirm={() =>
    //         onPublishChange(record.unique_id, !(record.pools_unpublished === 0))
    //       }
    //       placement="topRight"
    //       disabled={user.role === 'staff'}
    //     >
    //       <Switch
    //         checkedChildren="Published"
    //         unCheckedChildren="Unpublished"
    //         checked={record.pools_unpublished === 0}
    //         loading={record.isUpdating}
    //         disabled={user.role === 'staff'}
    //       />
    //     </Popconfirm>
    //   ),
    // },
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
      type: actions.FETCH_INTAKE_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, runs]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Intake</h4>
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
          className={styles.rangePicker}
        />
      </div>
      <Table
        columns={columns}
        loading={runs.isLoading}
        pagination={false}
        scroll={{ x: 1000 }}
      />
      <TableFooter
        loading={runs.isLoading}
        disabled={runs.items.length >= runs.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default Runs;
