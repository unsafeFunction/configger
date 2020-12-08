import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag, Input, Form } from 'antd';
import { CompanyModal } from 'components/widgets/companies';
import { debounce } from 'lodash';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss';
import { constants } from '../../utils/constants';

const Companies = () => {
  const dispatchCompaniesData = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  const allCompanies = useSelector(state => state.companies.all);
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const getStatus = status => {
    switch (status) {
      case 'COMPLETED':
        return <Tag color="#32CD32">{status}</Tag>;
      case 'SCHEDULED':
        return <Tag color="#1B55e3">{status}</Tag>;
      case 'DRAFT':
        return <Tag color="#6c757d">{status}</Tag>;
      case 'DELIVERED':
        return <Tag color="#28a745">{status}</Tag>;
      case 'FAILED':
        return <Tag color="#dc3545">{status}</Tag>;
      default:
        return <Tag color="#fd7e14">{status}</Tag>;
    }
  };

  const removeCampaign = useCallback(
    id => {
      dispatchCompaniesData({
        type: actions.REMOVE_CAMPAIGN_REQUEST,
        payload: {
          id,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const setCompanyId = useCallback(
    value => {
      dispatchCompaniesData({
        type: actions.ON_COMPANY_DATA_CHANGE,
        payload: {
          name: 'id',
          value,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const createCampaign = useCallback(() => {
    dispatchCompaniesData({
      type: actions.CREATE_CAMPAIGN_REQUEST,
      payload: {},
    });
  }, [dispatchCompaniesData, singleCampaign]);

  const createCompany = useCallback(async () => {
    const fieldValues = await form.validateFields();
    dispatchCompaniesData({
      type: actions.CREATE_COMPANY_REQUEST,
      payload: { ...fieldValues },
    });
    console.log(fieldValues);
  }, []);

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      render: (name, company) => {
        return (
          <Link
            onClick={() => {
              setCompanyId(company?.unique_id);
            }}
            to={`/companies/${company?.unique_id}`}
          >
            {`${name || '-'}`}
          </Link>
        );
      },
    },
    {
      title: 'Short Name',
      dataIndex: 'name_short',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Company Id',
      dataIndex: 'company_id',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (action, company) => {
        return (
          <Button
            type="danger"
            ghost
            icon={<DeleteOutlined />}
            onClick={() =>
              dispatchCompaniesData({
                type: modalActions.SHOW_MODAL,
                modalType: 'WARNING_MODAL',
                modalProps: {
                  message: () => (
                    <h4>{`You try to delete ${company.name}. Are you sure?`}</h4>
                  ),
                  title: 'Remove campaign',
                  onOk: () => removeCampaign(company.id),
                },
              })
            }
          />
        );
      },
    },
  ];

  const useFetching = () => {
    useEffect(() => {
      dispatchCompaniesData({
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
          search: searchName,
        },
      });
    }, []);
  };

  const onPageChange = page => {
    dispatchCompaniesData({
      type: actions.LOAD_CAMPAIGN_REQUEST,
      payload: {
        page,
      },
    });
  };

  useFetching();

  const onModalToggle = useCallback(() => {
    dispatchCompaniesData({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Create company',
        onOk: createCompany,
        cancelButtonProps: { className: classNames(styles.modalButton) },
        okButtonProps: {
          className: classNames(styles.modalButton, styles.createCompanyModal),
          loading: allCompanies.isLoading,
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Create',
        message: () => <CompanyModal form={form} />,
        width: '40%',
      },
    });
  }, [dispatchCompaniesData]);

  const loadMore = useCallback(() => {
    dispatchCompaniesData({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: allCompanies.offset,
        search: searchName,
      },
    });
  }, [dispatchCompaniesData, allCompanies]);

  const sendQuery = useCallback(
    query => {
      if (query || query === '') {
        dispatchCompaniesData({
          type: actions.FETCH_COMPANIES_REQUEST,
          payload: {
            limit: constants.companies.itemsLoadingCount,
            search: query,
          },
        });
      }
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
        <h4>Companies</h4>
        <div className={styles.tableActionsWrapper}>
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
            className={classNames(
              styles.createButton,
              'text-center',
              'btn',
              'btn-info',
            )}
          >
            Create Company
          </Button>
        </div>
      </div>
      <InfiniteScroll
        next={loadMore}
        hasMore={allCompanies.items.length < allCompanies.total}
        loader={<div className={styles.infiniteLoadingIcon}>{spinIcon}</div>}
        dataLength={allCompanies.items.length}
      >
        <Table
          dataSource={allCompanies.items}
          columns={columns}
          scroll={{ x: 1200 }}
          bordered
          loading={!allCompanies.isLoading}
          align="center"
          pagination={{
            pageSize: allCompanies.items.length,
            hideOnSinglePage: true,
          }}
        />
      </InfiniteScroll>
    </>
  );
};

export default Companies;
