import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
// import ProfileInfo from '../profileInfo';
// import Password from '../password';
import {
  Table,
  Button,
  DatePicker,
  Spin,
  Switch,
  Popconfirm,
  Input,
} from 'antd';
import moment from 'moment-timezone';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import Pools from 'pages/pools';
import { constants } from 'utils/constants';
import { debounce } from 'lodash';

moment.tz.setDefault('America/New_York');

const Run = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');

  const runId = history.location.pathname.split('/')[2];
  console.log('runId', runId);
  // const pathArray = location.pathname.slice(1).split('/');

  const run = useSelector(state => state.run);
  const pools = useSelector(state => state.pools);

  // const { from, to } = qs.parse(location.search, {
  //   ignoreQueryPrefix: true,
  // });
  // console.log('from to 11111', from, to);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
        payload: {
          runId: runId,
          limit: constants.pools.itemsLoadingCount,
        },
      });
    }, []);
  };

  useFetching();

  const sendQuery = useCallback(
    query => {
      if (query || query === '') {
        dispatch({
          type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
          payload: {
            runId: runId,
            limit: constants.pools.itemsLoadingCount,
            search: query,
          },
        });
      }
    },
    [searchName],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(event => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
      payload: {
        runId: runId,
        limit: constants.pools.itemsLoadingCount,
        offset: pools.offset,
      },
    });
  }, [dispatch, pools]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Run</h4>
        <Input
          size="middle"
          prefix={<SearchOutlined />}
          className={styles.search}
          placeholder="Search..."
          value={searchName}
          onChange={onChangeSearch}
        />
      </div>

      {/* <InfiniteScroll
        next={loadMore}
        hasMore={pools.items.length < pools.total}
        loader={
          <div className={styles.spin}>
            <Spin />
          </div>
        }
        dataLength={pools.items.length}
      > */}
      {/* <Pools loadMore={loadMore} /> */}
      <Pools />
      {/* </InfiniteScroll> */}
    </>
  );
};

export default Run;
