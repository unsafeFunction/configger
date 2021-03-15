import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import PoolTable from 'components/widgets/pools/PoolTable';
import { constants } from 'utils/constants';
import debounce from 'lodash.debounce';
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
        <h4>Run {pools?.filename ? `- ${pools?.filename}` : ''}</h4>
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
