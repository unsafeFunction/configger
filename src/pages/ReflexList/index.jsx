/* eslint-disable indent */
import { DatePicker, Empty, Table } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/reflexList/actions';
import { constants } from 'utils/constants';
import { columns, expandedColumns } from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const ReflexList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const reflexList = useSelector((state) => state.reflexList.all);

  const { date } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_REFLEX_LIST_REQUEST,
        payload: {
          date,
          limit: constants?.reflexList?.itemsLoadingCount,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, date, history]);
  };

  useFetching();

  const onDateChange = useCallback(
    (date, dateString) => {
      history.push({
        search: date ? `?date=${dateString}` : '',
      });
    },
    [history],
  );

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_REFLEX_LIST_REQUEST,
      payload: {
        date,
        limit: constants?.reflexList?.itemsLoadingCount,
        offset: reflexList.offset,
      },
    });
  }, [dispatch, date, reflexList]);

  const expandedRow = (sampleDetails) => {
    return (
      <Table
        dataSource={sampleDetails}
        columns={expandedColumns}
        pagination={false}
        rowKey={(record) => record.tube_type}
      />
    );
  };

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Reflex List</h4>
        <DatePicker
          defaultValue={date ? moment(date) : null}
          format="YYYY-MM-DD"
          onChange={onDateChange}
        />
      </div>

      <h5 className="mb-3">{moment(date).format('LL')}</h5>

      <InfiniteScroll
        next={loadMore}
        hasMore={reflexList.items.length < reflexList.total}
        dataLength={reflexList.items.length}
      >
        <Table
          className="mb-5"
          pagination={false}
          columns={columns}
          dataSource={reflexList.items}
          scroll={{ x: 1200 }}
          rowKey={(record) => record.sample_id}
          expandedRowRender={(record) => expandedRow(record.result_values)}
          locale={{
            emptyText: () => (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 80,
                }}
                description={<span>No samples to reflex for this date</span>}
                className="mt-2 mb-2"
              />
            ),
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default ReflexList;
