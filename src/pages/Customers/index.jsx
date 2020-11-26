import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag, Spin, Space, notification, Switch, Input } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import actions from 'redux/user/actions';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';
import styles from './styles.module.scss';
import debounce from "lodash.debounce";

const Campaigns = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchName, setSearchName] = useState('');
  const { isLoading, reinvitingUser, items, total } = useSelector(
    state => state.user,
  );

  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const dateFormat = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeFormat = { hour: '2-digit', minute: '2-digit' };

  const loadPage = nextPage => {
    if (total && nextPage > 5) {
      notification.warning({
        description: 'You loaded all information about users.',
      });
      setHasMore(false);
      return;
    }
    dispatch({
      type: actions.LOAD_USERS_REQUEST,
      payload: {
        page: nextPage,
      },
    });
    setPage(nextPage);
  };

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

  const searchUser = useCallback(debounce(name => {
    if (!name) {
      setPage(0);
      setHasMore(true);
      return;
    }
    setHasMore(false);
    dispatch({
      type: actions.SEARCH_USER_REQUEST,
      payload: {
        name,
      },
    });
  }, 500), [searchName]);

  const convertDateTime = rawDate => {
    const date = new Date(rawDate);
    return `${date.toLocaleDateString(
      'en-CA',
      dateFormat,
    )} ${date.toLocaleString('en-US', timeFormat)}`;
  };

  useEffect(() => {
    searchUser(searchName);
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
          className="text-center btn btn-info"
          htmlType="submit"
        >
          Invite Customer
        </Button>
      </div>
      <div className={styles.table}>
        <InfiniteScroll
          pageStart={page}
          loadMore={() => loadPage(page + 1)}
          hasMore={!isLoading && hasMore}
          useWindow={false}
        >
          <Table
            dataSource={items}
            pagination={false}
            columns={columns}
            loading={{
              spinning: isLoading,
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
