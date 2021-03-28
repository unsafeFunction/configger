import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Input } from 'antd';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import actions from 'redux/pools/actions';

import { constants } from 'utils/constants';
import PoolTable from 'components/widgets/pools/PoolTable';
import styles from './styles.module.scss';

const Pools = () => {
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState('');

  const pools = useSelector(state => state.pools);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_ALL_POOLS_REQUEST,
        payload: {
          limit: constants.pools.itemsLoadingCount,
          search: searchName,
        },
      });
    }, []);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_ALL_POOLS_REQUEST,
      payload: {
        limit: constants.pools.itemsLoadingCount,
        offset: pools.offset,
        search: searchName,
      },
    });
  }, [dispatch, pools]);

  const sendQuery = useCallback(
    query => {
      dispatch({
        type: actions.FETCH_ALL_POOLS_REQUEST,
        payload: {
          limit: constants.pools.itemsLoadingCount,
          search: query,
        },
      });
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

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pools</h4>
        <div className={styles.tableActionsWrapper}>
          <Input
            size="middle"
            prefix={<SearchOutlined />}
            className={styles.search}
            placeholder="Search..."
            value={searchName}
            onChange={onChangeSearch}
          />
        </div>
      </div>
      <PoolTable loadMore={loadMore} />
    </>
  );
};

export default Pools;
