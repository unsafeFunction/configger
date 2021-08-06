import { DatePicker, Table } from 'antd';
import classNames from 'classnames';
import Loader from 'components/layout/Loader';
import moment from 'moment-timezone';
import qs from 'qs';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import actions from 'redux/reflexList/actions';
import { constants } from 'utils/constants';
import { columns, expandedColumns } from './components';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ReflexList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dates, setDates] = useState([]);
  const location = useLocation();
  const stateRef = useRef();
  stateRef.current = dates;

  const reflexList = useSelector((state) => state.reflexList.all);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? {
              created_after: from,
              created_before: to,
              limit: constants?.reflexList?.itemsLoadingCount,
            }
          : { limit: constants?.reflexList?.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_REFLEX_LIST_REQUEST,
        payload: {
          ...params,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, from, to, history]);
  };

  useFetching();

  const onDatesChange = useCallback(
    (dates, dateStrings) => {
      if (dates) {
        history.push({
          search: `?from=${dateStrings[0]}&to=${dateStrings[1]}`,
        });
        setDates(dateStrings);
      } else {
        history.push({ search: '' });
        setDates([]);
      }
    },
    [history],
  );

  const loadMore = useCallback(() => {
    const params =
      from && to
        ? {
            created_after: from,
            created_before: to,
            limit: constants?.runs?.itemsLoadingCount,
            offset: reflexList.offset,
          }
        : {
            limit: constants?.runs?.itemsLoadingCount,
            offset: reflexList.offset,
          };
    dispatch({
      type: actions.FETCH_REFLEX_LIST_REQUEST,
      payload: {
        ...params,
      },
    });
  }, [dispatch, from, to, reflexList]);

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

  if (reflexList.isLoading) {
    return <Loader />;
  }

  // TODO: add case for empty items[]
  // if (Object.keys(reflexList?.items ?? []).length === 0) {
  //   return (
  //     <Empty
  //       imageStyle={{
  //         height: 60,
  //       }}
  //     >
  //       <Button
  //         // onClick={clearFilter}
  //         type="primary"
  //       >
  //         Clear filter
  //       </Button>
  //     </Empty>
  //   );
  // }

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Reflex List</h4>
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
        hasMore={reflexList.items.length < reflexList.total}
        dataLength={reflexList.items.length}
      >
        {reflexList.items.map((item) => (
          <Fragment key={item.id}>
            <h5>{moment(item.date).format('LL')}</h5>
            <Table
              className="mb-5"
              pagination={false}
              columns={columns}
              dataSource={item.samples}
              scroll={{ x: 1200 }}
              rowKey={(record) => record.sample_id}
              expandedRowRender={(record) => expandedRow(record.details)}
            />
          </Fragment>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default ReflexList;
