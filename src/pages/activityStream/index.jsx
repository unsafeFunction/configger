import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/activityStream/actions';
import { DatePicker, Spin, Timeline, Empty } from 'antd';
import { UserOutlined, UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { RangePicker } = DatePicker;

const ActivityStream = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [dates, setDates] = useState([]);

  const userId = history.location.pathname.split('/')[2];

  const activityStream = useSelector(state => state.activityStream);

  const { from, to } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const useFetching = () => {
    useEffect(() => {
      const params =
        from && to
          ? { from, to, limit: constants?.activityStream?.itemsLoadingCount }
          : { limit: constants?.activityStream?.itemsLoadingCount };
      dispatch({
        type: actions.FETCH_ACTIVITY_BY_USER_ID_REQUEST,
        payload: {
          userId,
          ...params,
        },
      });
    }, [dispatch, dates, history]);
  };

  useFetching();

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
            limit: constants?.activityStream?.itemsLoadingCount,
            offset: activityStream?.offset,
          }
        : {
            limit: constants?.activityStream?.itemsLoadingCount,
            offset: activityStream?.offset,
          };
    dispatch({
      type: actions.FETCH_ACTIVITY_BY_USER_ID_REQUEST,
      payload: {
        userId,
        ...params,
      },
    });
  }, [dispatch, from, to, activityStream]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Activity Stream</h4>
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
      <InfiniteScroll
        next={loadMore}
        hasMore={activityStream?.items?.length < activityStream?.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={activityStream?.items?.length}
      >
        {activityStream?.items?.length ? (
          <Timeline
            mode="right"
            pending={activityStream.isLoading}
            className="pt-3"
          >
            {activityStream.items.map(item => (
              <Timeline.Item
                key={item.id}
                label={item.timestamp_localtime}
                dot={
                  item.verb === 'invited' ? (
                    <UserAddOutlined style={{ fontSize: '16px' }} />
                  ) : null || item.verb === 'viewed timeline' ? (
                    <EyeOutlined style={{ fontSize: '16px' }} />
                  ) : null
                }
              >
                {item.verb}
                {item.verb === 'hijacked session' ? (
                  <span>
                    {' '}
                    <span className="badge badge-primary font-weight-normal bg-primary">
                      <UserOutlined /> {item.action_object?.name}
                    </span>{' '}
                    from{' '}
                    <i className="text-primary">
                      {item.action_object?.company}
                    </i>
                  </span>
                ) : null}
                {item.verb === 'unpublished' ? (
                  <b>
                    {' '}
                    {item.action_object?.title} {item.action_object?.model_type}
                  </b>
                ) : null}
                {item.verb === 'invited' || item.verb === 'reinvited' ? (
                  <span>
                    {' '}
                    to{' '}
                    <i className="text-primary">
                      {item.action_object?.company}
                    </i>
                  </span>
                ) : null}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </InfiniteScroll>
    </>
  );
};

export default ActivityStream;
