import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Tag,
  Spin,
  Space,
  notification,
  List,
  Modal,
  Switch,
} from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import actions from 'redux/user/actions';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';
import styles from './styles.module.scss';

const Campaigns = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { isLoading, isReinviting, items, total } = useSelector(
    state => state.user,
  );

  const spinIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  const Loading = nextPage => {
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

  const convertDateTime = rawDate => {
    const date = new Date(rawDate);
    return `${date.toLocaleDateString()} ${date.toLocaleString('en-US', {
      timeStyle: 'short',
    })}`;
  };

  const columns = [
    {
      title: 'Full name',
      dataIndex: 'fullname',
      key: 'fullname',
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company name',
      dataIndex: 'company',
      key: 'company',
      width: '30%',
    },
    {
      title: 'Confiramtion statuses',
      key: 'verified',
      render: (verified, record) => (
        <>
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
        </>
      ),
    },
    {
      title: 'Last login',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (text, record) => <p>{convertDateTime(text)}</p>,
    },
    {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            className={styles.action}
            loading={isReinviting}
            onClick={() => reinviteUser(record.id)}
          >
            Reinvite
          </Button>
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.is_active}
            className={classNames({ [styles.action]: record.is_active })}
            onClick={() => toggleUser(record.id, record.is_active)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.table}>
      <InfiniteScroll
        pageStart={page}
        loadMore={() => Loading(page + 1)}
        hasMore={!isLoading && hasMore}
        useWindow={false}
      >
        <Table
          dataSource={items}
          pagination={false}
          columns={columns}
          // className={styles.table}
          loading={{
            spinning: isLoading,
            indicator: <Spin indicator={spinIcon} className={styles.loader} />,
          }}
          scroll={{ x: 1500, y: 1500 }}
          // scroll={{y: '83vh'}}
          bordered
        />
      </InfiniteScroll>
    </div>
  );
};

export default Campaigns;
