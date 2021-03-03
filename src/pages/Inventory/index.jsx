import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag, Input, Form, Tooltip, Switch, Dropdown, Menu, Tabs} from 'antd';
import { CompanyModal } from 'components/widgets/companies';
import debounce from 'lodash.debounce';
import {
  LoadingOutlined,
  SearchOutlined,
  BankOutlined,
  FileOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import companyActions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss';
import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';

const Inventory = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatchCompaniesData = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  const allCompanies = useSelector(state => state.companies.all);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  useEffect(() => {
    if (allCompanies.error) {
      form.setFields([
        ...Object.keys(allCompanies?.error)?.map?.(field => {
          return {
            name: field,
            errors: [`${allCompanies?.error?.[field]}`],
          };
        }),
      ]);
    }
  }, [allCompanies.error]);

  const createCompany = useCallback(async () => {
    const fieldValues = await form.validateFields();
    dispatchCompaniesData({
      type: companyActions.CREATE_COMPANY_REQUEST,
      payload: { ...fieldValues },
    });
  }, []);


  const columns = [
    {
      title: 'Tube ID',
      dataIndex: 'tube_id',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Control',
      dataIndex: 'control',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Created On',
      dataIndex: 'created_on',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'User',
      dataIndex: 'user',
      render: value => {
        return value || '-';
      },
    }
  ];

  const useFetching = () => {
    useEffect(() => {
      dispatchCompaniesData({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
          search: searchName,
        },
      });
    }, []);
  };

  useFetching();

  const onModalToggle = useCallback(() => {
    dispatchCompaniesData({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Add company',
        onOk: createCompany,
        cancelButtonProps: { className: styles.modalButton },
        okButtonProps: {
          className: styles.modalButton,
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Create',
        message: () => <CompanyModal form={form} />,
      },
    });
  }, [dispatchCompaniesData]);

  const loadMore = useCallback(() => {
    dispatchCompaniesData({
      type: companyActions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: allCompanies.offset,
        search: searchName,
      },
    });
  }, [dispatchCompaniesData, allCompanies]);

  const sendQuery = useCallback(
    query => {
      dispatchCompaniesData({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
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
        {isTablet ? (
          <div className={styles.mobileTableHeaderWrapper}>
            <div className={styles.mobileTableHeaderRow}>
              <h4>Inventory</h4>
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isTablet && 'ml-3'}
              >
                Add Control Tube
              </Button>
            </div>
            <Input
              size="middle"
              prefix={<SearchOutlined />}
              className={styles.search}
              placeholder="Search..."
              value={searchName}
              onChange={onChangeSearch}
            />
          </div>
        ) : (
          <>
            <h4>Inventory</h4>
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
                value={searchName}
                onChange={onChangeSearch}
              />
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isMobile && 'ml-3'}
              >
                Add Control Tube
              </Button>
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

export default Inventory;
