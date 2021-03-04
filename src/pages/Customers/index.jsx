import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Tag,
  Spin,
  Space,
  Switch,
  Input,
  Form,
  Tooltip,
} from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import actions from 'redux/customers/actions';
import modalActions from 'redux/modal/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import HijackBtn from 'components/widgets/hijack/HijackBtn';
import { useHistory, Link } from 'react-router-dom';
import { constants } from 'utils/constants';
import useWindowSize from 'hooks/useWindowSize';
import styles from './styles.module.scss';

const Customers = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isMobile, isTablet } = useWindowSize();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchName, setSearchName] = useState('');
  const customers = useSelector(state => state.customers);
  const tableRef = useRef(null);
  const [form] = Form.useForm();
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const dateFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeFormat = { hour: '2-digit', minute: '2-digit' };

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_CUSTOMERS_REQUEST,
        payload: {
          limit: constants?.customers?.itemsLoadingCount,
          // search: searchName,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_CUSTOMERS_REQUEST,
      payload: {
        limit: constants?.customers?.itemsLoadingCount,
        offset: customers?.offset,
        search: searchName,
      },
    });
  }, [dispatch, customers, searchName]);

  const sendQuery = useCallback(
    query => {
      dispatch({
        type: actions.FETCH_CUSTOMERS_REQUEST,
        payload: {
          limit: constants?.customers?.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch, searchName],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    event => {
      setSearchName(event.target.value);
      delayedQuery(event.target.value);
    },
    [setSearchName],
  );

  const reinviteUser = useCallback(id => {
    dispatch({
      type: actions.REINVITE_REQUEST,
      payload: {
        id,
      },
    });
  });

  const toggleUser = useCallback((id, currentStatus) => {
    dispatch({
      type: actions.SET_STATUS_REQUEST,
      payload: {
        id,
        status: !currentStatus,
      },
    });
  });

  const loadCompanies = page => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        page,
        search: '',
      },
    });
  };

  const onInvite = async () => {
    const fieldValues = await form.validateFields();
    dispatch({
      type: actions.INVITE_CUSTOMER_REQUEST,
      payload: { ...fieldValues },
    });
  };

  const convertDateTime = rawDate => {
    const date = new Date(rawDate);
    return `${date.toLocaleDateString(
      'en-CA',
      dateFormat,
    )} ${date.toLocaleString('en-US', timeFormat)}`;
  };

  const columns = [
    {
      title: 'Full name',
      key: 'fullname',
      render: (_, record) => (
        <Link to={`/users/${record.id}`} className="text-blue">
          {record.first_name} 
{' '}
{record.last_name}
        </Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 'auto',
    },
    {
      title: 'Company name',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Confiramtion statuses',
      width: '175px',
      render: (_, record) => (
        <div className={classNames(styles.columnElements, styles.tagColumn)}>
          {record.verified ? (
            <Tag icon={<CheckCircleOutlined />} color="processing">
              Email confirmed
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Email not confirmed
            </Tag>
          )}
          {record.terms_accepted ? (
            <Tag icon={<CheckCircleOutlined />} color="processing">
              Terms accepted
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="volcano">
              Terms not accepted
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Last login',
      dataIndex: 'last_login',
      key: 'last_login',
      width: '150px',
      render: text => <span>{convertDateTime(text)}</span>,
    },
    {
      title: 'Actions',
      fixed: 'right',
      key: 'action',
      width: isMobile ? 100 : 180,
      render: (_, record) => (
        <div className={styles.actions}>
          <div className={styles.actionsBtns}>
            <Tooltip
              title={`Reinvite ${record.first_name} ${record.last_name}`}
              placement="bottomRight"
            >
              <Button
                type="primary"
                ghost
                icon={<SendOutlined />}
                disabled={record.id === customers?.reinvitingUser}
                onClick={() => reinviteUser(record.id)}
              />
            </Tooltip>
            <HijackBtn
              userId={record.id}
              userFirstName={record.first_name}
              userLastName={record.last_name}
              userRole={record.role}
              path={history.location.pathname}
              userIsActive={record.is_active}
            />
          </div>

          <Switch
            className={styles.switchBtn}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.is_active}
            onClick={() => toggleUser(record.id, record.is_active)}
          />
        </div>
      ),
    },
  ];

  const data = customers?.items?.map?.(item => ({
    ...item,
    key: item.id,
  }));

  return (
    <div>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        {isMobile ? (
          <div className={styles.mobileTableHeaderWrapper}>
            <div className={styles.mobileTableHeaderRow}>
              <h4>Users</h4>
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
            <h4>Users</h4>
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

      <div className={styles.table}>
        <InfiniteScroll
          next={loadMore}
          hasMore={customers?.items?.length < customers?.total}
          dataLength={customers?.items?.length}
        >
          <Table
            dataSource={data}
            pagination={false}
            columns={columns}
            loading={{
              spinning: customers?.areUsersLoading,
              indicator: (
                <Spin indicator={spinIcon} className={styles.loader} />
              ),
            }}
            bordered
            scroll={{ x: 1400 }}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Customers;
