import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Input, Button } from 'antd';
import debounce from 'lodash.debounce';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/scanSessions/actions';

import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';
import styles from './styles.module.scss';

const ScanSessions = () => {
  const { isMobile, isTablet } = useWindowSize();
  const dispatch = useDispatch();
  const scanSessions = useSelector(state => state.scanSessions.sessions);
  const history = useHistory();

  const navigateToScan = useCallback(
    scanId => {
      history.push(`/scan-sessions/${scanId}`);
    },
    [history],
  );
  const columns = [
    {
      title: 'Session name',
      dataIndex: 'pool_name',
    },
    {
      title: 'Session size',
      dataIndex: 'pool_size',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Scanned on',
      dataIndex: 'scanned_on',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Scanned by',
      dataIndex: 'scanned_by',
      render: value => {
        return value || '-';
      },
    },
  ];

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SCAN_SESSIONS_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
          //   search: searchName,
        },
      });
    }, []);
  };

  const expandedRow = pool => {
    const columns = [
      { title: 'Pool ID', dataIndex: 'pool_id', key: 'pool_id' },
      { title: 'Rack ID', dataIndex: 'rack_id', key: 'rack_id' },
      { title: 'Action', dataIndex: 'action', key: 'action' },
    ];

    return <Table columns={columns} dataSource={pool} pagination={false} />;
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: scanSessions.offset,
      },
    });
  }, [dispatch, scanSessions]);

  const sendQuery = useCallback(query => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        search: query,
      },
    });
  }, []);

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(event => {
    // setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        {isMobile ? (
          <div className={styles.mobileTableHeaderWrapper}>
            <div className={styles.mobileTableHeaderRow}>
              <h4>Scan Sessions</h4>
            </div>
            <Input
              size="middle"
              prefix={<SearchOutlined />}
              className={styles.search}
              placeholder="Search..."
              //   value={searchName}
              onChange={onChangeSearch}
            />
          </div>
        ) : (
          <>
            <h4>Scan Sessions</h4>
            <div
              className={classNames(styles.tableActionsWrapper, {
                [styles.tabletActionsWrapper]: isTablet,
              })}
            >
              <Input
                size="middle"
                prefix={<SearchOutlined />}
                className={styles.search}
                placeholder="Search..."
                // value={searchName}
                onChange={onChangeSearch}
              />
            </div>
          </>
        )}
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={scanSessions?.items?.length < scanSessions?.total}
        loader={<LoadingOutlined style={{ fontSize: 36 }} spin />}
        dataLength={scanSessions?.items?.length}
      >
        <Table
          dataSource={scanSessions?.items}
          columns={columns}
          scroll={{ x: 1200 }}
          bordered
          loading={!scanSessions?.isLoading}
          align="center"
          pagination={{
            pageSize: scanSessions?.items?.length,
            hideOnSinglePage: true,
          }}
          expandedRowRender={record => {
            return expandedRow(
              record.pools.map((pool, index) => {
                return {
                  key: pool.pool_id,
                  pool_id: pool.pool_id,
                  rack_id: pool?.rack_id,
                  action: (
                    <Button
                      onClick={() => navigateToScan(pool.pool_id)}
                      type="primary"
                    >
                      View scan
                    </Button>
                  ),
                };
              }),
            );
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default ScanSessions;
