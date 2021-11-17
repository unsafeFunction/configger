/* eslint-disable prettier/prettier */
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import PoolTable from 'components/widgets/Pools/PoolTable';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';
import useCustomFilters from '../../utils/useCustomFilters';

const Pools = () => {
  const dispatch = useDispatch();

  const initialFiltersState = {
    search: '',
  };

  const [filtersState, filtersDispatch] = useCustomFilters(initialFiltersState);

  const pools = useSelector((state) => state.pools);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_ALL_POOLS_REQUEST,
        payload: {
          limit: constants.pools.itemsLoadingCount,
          search: filtersState.search,
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
        search: filtersState.search,
      },
    });
  }, [dispatch, pools, filtersState.search]);

  const sendQuery = useCallback(
    (query) => {
      dispatch({
        type: actions.FETCH_ALL_POOLS_REQUEST,
        payload: {
          limit: constants.pools.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    (event) => {
      const { target } = event;

      filtersDispatch({
        type: 'setValue',
        payload: {
          name: 'search',
          value: target.value,
        },
      });

      return delayedQuery(target.value);
    },
    [filtersDispatch, delayedQuery],
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pools</h4>
      </div>
      <PoolTable
        searchInput={
          <Input
            size="middle"
            prefix={<SearchOutlined />}
            className={styles.search}
            placeholder="Search..."
            value={filtersState.search}
            onChange={onChangeSearch}
            allowClear
          />
        }
        loadMore={loadMore}
      />
    </>
  );
};

export default Pools;
