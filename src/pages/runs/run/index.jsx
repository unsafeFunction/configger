import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
// import ProfileInfo from '../profileInfo';
// import Password from '../password';
import { Table, Button, DatePicker, Spin, Switch, Popconfirm } from 'antd';
import moment from 'moment-timezone';
import is from 'is_js';
import { PlusCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
// import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './../styles.module.scss';
import Pools from 'pages/pools';

moment.tz.setDefault('America/New_York');

const runsPage = {
  defaultLoadingNumber: 20,
  initialLoadingNumber: 40,
};

const Run = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const runId = history.location.pathname.split('/')[2];
  console.log('runId', runId);
  // const pathArray = location.pathname.slice(1).split('/');

  const run = useSelector(state => state.run);
  console.log('RUN !!!!!!!!!!!!!!!!!!', run);

  // const { from, to } = qs.parse(location.search, {
  //   ignoreQueryPrefix: true,
  // });
  // console.log('from to 11111', from, to);

  const useFetching = () => {
    useEffect(() => {
      // const params =
      //   from && to
      //     ? { from: from, to: to, limit: runsPage.defaultLoadingNumber }
      //     : { limit: runsPage.defaultLoadingNumber };
      // console.log('params', params);
      dispatch({
        type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
        payload: {
          // ...params,
          runId: runId,
          limit: runsPage.defaultLoadingNumber,
        },
      });
    }, []);
  };

  useFetching();

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Run</h4>
      </div>

      <Pools />
    </>
  );
};

export default Run;
