import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag, Input, Form } from 'antd';
import { CompanyModal } from 'components/widgets/companies';
import debounce from 'lodash.debounce';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';

import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';
import styles from './styles.module.scss';

const ScanSessions = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatch = useDispatch();

  const allCompanies = useSelector(state => state.companies.all);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const columns = [
    {
      title: 'Pool name',
      dataIndex: 'pool_name',
    },
    {
      title: 'Pool size',
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
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
          //   search: searchName,
        },
      });
    }, []);
  };

  const onPageChange = page => {
    dispatch({
      type: actions.LOAD_CAMPAIGN_REQUEST,
      payload: {
        page,
      },
    });
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: allCompanies.offset,
      },
    });
  }, [dispatch, allCompanies]);

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
        hasMore={allCompanies?.items?.length < allCompanies?.total}
        loader={<div className={styles.infiniteLoadingIcon}>{spinIcon}</div>}
        dataLength={allCompanies?.items?.length}
      >
        <Table
          dataSource={allCompanies?.items}
          columns={columns}
          scroll={{ x: 1200 }}
          bordered
          loading={!allCompanies?.isLoading}
          align="center"
          pagination={{
            pageSize: allCompanies?.items?.length,
            hideOnSinglePage: true,
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default ScanSessions;
