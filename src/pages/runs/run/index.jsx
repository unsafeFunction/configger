import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import PoolTable from 'components/widgets/Pools/PoolTable';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from 'redux/pools/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Run = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');

  const runId = history.location.pathname.split('/')[2];

  const pools = useSelector((state) => state.pools);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
        payload: {
          runId,
          limit: constants.poolsByRun.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const sendQuery = useCallback(
    (query) => {
      dispatch({
        type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
        payload: {
          runId,
          limit: constants.poolsByRun.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch, searchName, runId],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback((event) => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_POOLS_BY_RUN_ID_REQUEST,
      payload: {
        runId,
        limit: constants.poolsByRun.itemsLoadingCount,
        offset: pools.offset,
        search: searchName,
      },
    });
  }, [dispatch, pools, searchName]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>
          Run
          {pools?.filename ? `- ${pools?.filename}` : ''}
        </h4>
        <Input
          size="middle"
          prefix={<SearchOutlined />}
          className={styles.search}
          placeholder="Search..."
          value={searchName}
          onChange={onChangeSearch}
        />
      </div>

      <PoolTable loadMore={loadMore} />
    </>
  );
};

export default Run;
