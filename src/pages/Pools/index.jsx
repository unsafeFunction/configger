/* eslint-disable prettier/prettier */
import { SearchOutlined } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import classNames from 'classnames';
import PoolTable from 'components/widgets/Pools/PoolTable';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/pools/actions';
import { constants } from 'utils/constants';
import useCustomFilters from 'utils/useCustomFilters';
import useWindowSize from 'hooks/useWindowSize';
import styles from './styles.module.scss';

const Pools = () => {
  const { isMobile } = useWindowSize();
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

  const popoverContent = (
    <div className={styles.popoverWrapper}>
      <p>You can search information using the following fields:</p>
      <p>
        <b>
          pool id, pool title, tube id, company id, company name, company name
          short.
        </b>
      </p>
    </div>
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Pools</h4>
        <div className={styles.tableActionsWrapper}>
          <Popover
            content={popoverContent}
            title="Search fields"
            trigger="hover"
            placement={isMobile ? 'bottom' : 'left'}
          >
            <Input
              size="middle"
              prefix={<SearchOutlined />}
              className={styles.search}
              placeholder="Search..."
              value={filtersState.search}
              onChange={onChangeSearch}
              allowClear
            />
          </Popover>
        </div>
      </div>
      <PoolTable loadMore={loadMore} />
    </>
  );
};

export default Pools;
