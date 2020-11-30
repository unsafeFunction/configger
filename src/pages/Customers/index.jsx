import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag, Spin, Space, Switch, Input, Form } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import userActions from 'redux/user/actions';
import modalActions from 'redux/modal/actions';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';
import styles from './styles.module.scss';
import debounce from "lodash.debounce";
import CustomerModal from 'components/widgets/Customer/CustomerModal';

const Campaigns = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchName, setSearchName] = useState('');
  const { areUsersLoading, areCompaniesLoading, reinvitingUser, items, total, companies } = useSelector(
    state => state.user,
  );
  const tableRef = useRef(null);
  const [form] = Form.useForm();
  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const dateFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeFormat = { hour: '2-digit', minute: '2-digit' };

  const loadPage = useCallback((nextPage, userName, isSearching) => {
    const initialLoad = !!page;

    if (hasMore && initialLoad && !isSearching && items.length >= total) {
      setHasMore(false);
      return;
    }
    dispatch({
      type: userActions.LOAD_USERS_REQUEST,
      payload: {
        page: nextPage,
        search: userName,
      },
    });
    setPage(nextPage);
  });

  const searchUser = useCallback(debounce((name, page) => {
    if (page) {
      loadPage(1, name, true);
      setHasMore(true);
      tableRef.current.scroll({ top: 0 });
    }
  }, 500), [searchName]);

  const reinviteUser = useCallback(id => {
    dispatch({
      type: userActions.REINVITE_REQUEST,
      payload: {
        id,
      },
    });
  });

  const toggleUser = useCallback((id, currentStatus) => {
    dispatch({
      type: userActions.SET_STATUS_REQUEST,
      payload: {
        id,
        status: !currentStatus,
      },
    });
  });

  const loadCompanies = (page, nextPageFunc) => {
    dispatch({
      type: userActions.LOAD_COMPANIES_REQUEST,
      payload: {
        page,
        search: '',
      },
    });
    console.log('current page:', page);
    nextPageFunc();
  }

  const showInviteModal = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'WARNING_MODAL',
      modalProps: {
        title: 'Invite customer',
        width: '30%',
        okText: 'Invite',
        onOk: async () => {
          try {
            const values = await form.validateFields();
            console.log('Validate Success:', 5);
          } catch (info) {
            console.log('Validate Failed:', info);
          }
        },
        message: () => (
          <CustomerModal 
            form={form}
            loadCompanies={loadCompanies}
          />
        ),
      }
    })
  });

  const convertDateTime = rawDate => {
    const date = new Date(rawDate);
    return `${date.toLocaleDateString(
      'en-CA',
      dateFormat,
    )} ${date.toLocaleString('en-US', timeFormat)}`;
  };

  useEffect(() => {
    searchUser(searchName, page);
    return searchUser.cancel;
  }, [searchName, searchUser]);

  const columns = [
    {
      title: 'Full name',
      key: 'fullname',
      render: (_, record) => (
        <span>
          {record.first_name} {record.last_name}
        </span>
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
      key: 'action',
      fixed: 'right',
      width: '130px',
      render: (_, record) => (
        <Space
          size="middle"
          className={classNames(styles.columnElements, styles.actionColumn)}
        >
          <Button
            type="primary"
            size="small"
            className={classNames(styles.action, styles.activeAction)}
            icon={<SendOutlined />}
            disabled={record.id === reinvitingUser}
            onClick={() => reinviteUser(record.id)}
          >
            Reinvite
          </Button>
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.is_active}
            className={classNames(styles.switch, styles.action, {
              [styles.activeAction]: record.is_active,
            })}
            onClick={() => toggleUser(record.id, record.is_active)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.subheader}>
        <Input
          size='middle' 
          prefix={ <SearchOutlined />} 
          className={styles.search}
          placeholder="Search..."
          value={searchName}
          onChange={event => setSearchName(event.target.value)}
        />
        <Button
          type="primary"
          size="large"
          className={classNames(styles.inviteButton, "text-center", "btn", "btn-info")}
          htmlType="submit"
          onClick={showInviteModal}
        >
          Invite Customer
        </Button>
      </div>
      <div ref={tableRef} className={styles.table}>
        <InfiniteScroll
          pageStart={page}
          loadMore={() => loadPage(page + 1, searchName)}
          hasMore={!areUsersLoading && hasMore}
          useWindow={false}
        >
          <Table
            dataSource={items}
            pagination={false}
            columns={columns}
            loading={{
              spinning: areUsersLoading,
              indicator: <Spin indicator={spinIcon} className={styles.loader} />,
            }}
            bordered
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Campaigns;
