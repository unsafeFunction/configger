import { SearchOutlined } from '@ant-design/icons';
import { Form, Input, Table } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import useWindowSize from 'hooks/useWindowSize';
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from 'redux/companies/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const Companies = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatchCompaniesData = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [form] = Form.useForm();

  const allCompanies = useSelector((state) => state.companies.all);
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

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      render: (name, company) => {
        return (
          <Link
            onClick={() => {
              setCompanyId(company?.id);
            }}
            to={`/companies/${company?.id}`}
            className="text-blue"
          >
            {`${name || '-'}`}
          </Link>
        );
      },
    },
    {
      title: 'Company Short',
      dataIndex: 'short_name',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Company ID',
      dataIndex: 'company_id',
      render: (value) => {
        return value || '-';
      },
    },
    {
      title: 'Added On',
      sorter: true,
      dataIndex: 'added_on',
      render: (value) => {
        return value ? moment(value).format(constants.dateFormat) : '–';
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

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      dispatchCompaniesData({
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          offset: allCompanies.offset,
          sort_by: sorter?.order
            ? sorter.order === 'ascend'
              ? `${sorter?.column?.dataIndex}`
              : `-${sorter?.column?.dataIndex}`
            : undefined,
        },
      });
    }
  };

  useFetching();

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
            </div>
          </>
        )}
      </div>
      <Table
        dataSource={allCompanies?.items}
        columns={columns}
        scroll={{ x: 1000 }}
        bordered
        loading={!allCompanies?.isLoading}
        align="center"
        onChange={handleTableChange}
        pagination={false}
        rowKey={(record) => record.id}
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
