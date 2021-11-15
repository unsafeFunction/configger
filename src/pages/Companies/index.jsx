import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Table, Tag } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import { CompanyModal } from 'components/widgets/companies';
import useWindowSize from 'hooks/useWindowSize';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Companies = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatchCompaniesData = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  const allCompanies = useSelector((state) => state.companies.all);
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const getStatus = (status) => {
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

  const setCompanyId = useCallback(
    (value) => {
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

  useEffect(() => {
    if (allCompanies.error) {
      form.setFields([
        ...Object.keys(allCompanies?.error)?.map?.((field) => {
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
      type: actions.CREATE_COMPANY_REQUEST,
      payload: { ...fieldValues },
    });
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
            className="text-blue"
          >
            {`${name || '-'}`}
          </Link>
        );
      },
    },
    {
      title: 'Short Name',
      dataIndex: 'name_short',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Company Id',
      dataIndex: 'company_id',
      render: (value) => {
        return value || '-';
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

  const onPageChange = (page) => {
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
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset: allCompanies.offset,
        search: searchName,
      },
    });
  }, [dispatchCompaniesData, allCompanies]);

  const sendQuery = useCallback(
    (query) => {
      dispatchCompaniesData({
        type: actions.FETCH_COMPANIES_REQUEST,
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

  const onChangeSearch = useCallback((event) => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        {isMobile ? (
          <div className={styles.mobileTableHeaderWrapper}>
            <div className={styles.mobileTableHeaderRow}>
              <h4>Companies</h4>
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isMobile && 'ml-3'}
              >
                Add Company
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
            <h4>Companies</h4>
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
                Add Company
              </Button>
            </div>
          </>
        )}
      </div>
      <Table
        dataSource={allCompanies?.items}
        columns={columns}
        scroll={{ x: 1200 }}
        loading={!allCompanies?.isLoading}
        align="center"
        pagination={false}
      />
      <TableFooter
        loading={!allCompanies?.isLoading}
        disabled={allCompanies?.items?.length >= allCompanies?.total}
        loadMore={loadMore}
      />
    </>
  );
};

export default Companies;
