/* eslint-disable indent */
import { DatePicker, Empty, Table } from 'antd';
import classNames from 'classnames';
import moment from 'moment-timezone';
import qs from 'qs';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/reflex/actions';
import { constants } from 'utils/constants';
import TableFooter from 'components/layout/TableFooterLoader';
import columns from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const ReflexList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const reflexList = useSelector((state) => state.reflex.all);

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

  return (
    <div>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Reflex List</h4>
      </div>

      <Table
        className="mb-5"
        pagination={false}
        columns={columns}
        dataSource={reflexList.items}
        scroll={{ x: 2000 }}
        rowKey={(record) => record.sample_id}
        title={() => {
          return (
            <div className="d-flex">
              <h5>{moment(date).format('LL')}</h5>
              <DatePicker
                className="ml-auto"
                defaultValue={date ? moment(date) : null}
                format="YYYY-MM-DD"
                onChange={onDateChange}
              />
            </div>
          );
        }}
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
      <TableFooter
        loading={reflexList?.isLoading}
        disabled={reflexList.items.length >= reflexList.total}
        loadMore={loadMore}
      />
    </div>
  );
};

export default ReflexList;
