import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Table, Button, Input, Form } from 'antd';
import { ControlTubeModal } from 'components/widgets/Inventory';
import debounce from 'lodash.debounce';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import companyActions from 'redux/companies/actions';
import actions from 'redux/inventory/actions';
import modalActions from 'redux/modal/actions';

import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';
import moment from 'moment-timezone';
import styles from './styles.module.scss';

const Inventory = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatchCompaniesData = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  const inventory = useSelector((state) => state.inventory);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const handleReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  const createControlTube = useCallback(async () => {
    const fieldValues = await form.validateFields();
    dispatchCompaniesData({
      type: actions.CREATE_INVENTORY_ITEM_REQUEST,
      payload: {
        item: fieldValues,
        resetForm: handleReset,
      },
    });
  }, [form, dispatchCompaniesData]);

  const columns = [
    {
      title: 'Tube ID',
      dataIndex: 'tube_id',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Control',
      dataIndex: 'control',
      render: (value) => {
        return (
          constants.controlTypes.find((type) => type.value === value)?.label ||
          '-'
        );
      },
    },
    {
      title: 'Created On',
      dataIndex: 'created',
      render: (_, value) => {
        return moment(value?.created).format('llll') || '-';
      },
    },
    {
      title: 'User',
      dataIndex: 'user',
      render: (value) => {
        return value || '-';
      },
    },
  ];

  const useFetching = () => {
    useEffect(() => {
      dispatchCompaniesData({
        type: actions.FETCH_INVENTORY_REQUEST,
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
        title: 'Add Control Tube',
        onOk: createControlTube,
        cancelButtonProps: { className: styles.modalButton },
        okButtonProps: {
          className: styles.modalButton,
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Create',
        message: () => <ControlTubeModal form={form} />,
      },
    });
  }, [dispatchCompaniesData]);

  const loadMore = useCallback(() => {
    dispatchCompaniesData({
      type: companyActions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: inventory.offset,
        search: searchName,
      },
    });
  }, [dispatchCompaniesData, inventory]);

  const sendQuery = useCallback(
    (query) => {
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
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    (event) => {
      setSearchName(event.target.value);
      delayedQuery(event.target.value);
    },
    [delayedQuery],
  );

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
        hasMore={inventory?.items?.length < inventory?.total}
        loader={<div className={styles.infiniteLoadingIcon}>{spinIcon}</div>}
        dataLength={inventory?.items?.length}
      >
        <Table
          dataSource={inventory?.items}
          columns={columns}
          scroll={{ x: 1200 }}
          bordered
          loading={inventory?.isLoading}
          align="center"
          pagination={{
            pageSize: inventory?.items?.length,
            hideOnSinglePage: true,
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default Inventory;
