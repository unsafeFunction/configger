import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  Table,
  Button,
  Tag,
  Input,
  Form,
  Tooltip,
  Switch,
  Dropdown,
  Menu,
  Tabs,
} from 'antd';
import { CompanyModal } from 'components/widgets/companies';
import debounce from 'lodash.debounce';
import {
  LoadingOutlined,
  SearchOutlined,
  BankOutlined,
  FileOutlined,
  DownOutlined,
} from '@ant-design/icons';
import companyActions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss';
import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';
import TableFooter from 'components/layout/TableFooterLoader';
const { TabPane } = Tabs;

const Management = () => {
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
        type: companyActions.ON_COMPANY_DATA_CHANGE,
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
      type: companyActions.CREATE_COMPANY_REQUEST,
      payload: { ...fieldValues },
    });
  }, []);

  const columns = [
    {
      title: 'Company ID',
      dataIndex: 'company_id',
      render: (name, company) => {
        return (
          <Link
            onClick={() => {
              setCompanyId(company?.unique_id);
            }}
            to={`/companies/${company?.unique_id}`}
            className="text-blue"
          >
            {`${company?.company_id || '-'}`}
          </Link>
        );
      },
    },
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
      title: 'Locations',
      dataIndex: 'company_locations',
      render: (value) => {
        return value?.map?.((location) => location?.title) || '-';
      },
    },
    {
      title: 'Actions',
      fixed: 'right',
      key: 'action',
      width: isMobile ? 100 : 190,
      render: (_, record) => (
        <div className={styles.actions}>
          <div className={styles.actionsBtns}>
            <Dropdown overlay={menu}>
              <Button>
                Edit <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={menuDelete}>
              <Button>
                Delete <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      ),
    },
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

  const handleMenuClick = useCallback((e) => {}, []);

  const menu = useMemo(
    () => (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<BankOutlined />}>
          Edit Company
        </Menu.Item>
        <Menu.Item key="2" icon={<FileOutlined />}>
          Edit Site
        </Menu.Item>
      </Menu>
    ),
    [],
  );

  const menuDelete = useMemo(
    () => (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<BankOutlined />}>
          Delete Company
        </Menu.Item>
        <Menu.Item key="2" icon={<FileOutlined />}>
          Delete Site
        </Menu.Item>
      </Menu>
    ),
    [],
  );

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

  const onChangeSearch = useCallback((event) => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        {isTablet ? (
          <div className={styles.mobileTableHeaderWrapper}>
            <div className={styles.mobileTableHeaderRow}>
              <h4>Management</h4>
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isTablet && 'ml-3'}
                icon={<BankOutlined />}
              >
                Add Company
              </Button>
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isTablet && 'ml-3'}
                icon={<FileOutlined />}
              >
                New Site
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
            <h4>Management</h4>
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
                icon={<BankOutlined />}
              >
                Add Company
              </Button>
              <Button
                onClick={onModalToggle}
                size="large"
                type="primary"
                className={!isMobile && 'ml-3'}
                icon={<FileOutlined />}
              >
                New Site
              </Button>
            </div>
          </>
        )}
      </div>
      <Tabs tabPosition={'left'} className={styles.tabs}>
        <TabPane tab="Client" key="client">
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
        </TabPane>
        <TabPane tab="Control Tube" key="control">
          Content of Tab 2
        </TabPane>
      </Tabs>
    </>
  );
};

export default Management;
