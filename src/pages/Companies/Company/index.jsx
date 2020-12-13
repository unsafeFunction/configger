import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  Tabs,
  Row,
  Col,
  Table,
  Card,
  Tag,
  Button,
  Skeleton,
  Spin,
  Form,
  Input,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ContactResultModal } from 'components/widgets/companies';
import modalActions from 'redux/modal/actions';
import companyAction from 'redux/companies/actions';
import { moment } from 'moment';
import PoolTable from 'components/widgets/pools/PoolTable';
import { default as poolsActions } from 'redux/pools/actions';
import { constants } from 'utils/constants';
import actions from 'redux/companies/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import { debounce } from 'lodash';

const { TabPane } = Tabs;

const getStatus = status => {
  switch (status) {
    case 'COMPLETED':
      return <Tag color="#32CD32">{status}</Tag>;
    case 'SCHEDULED':
      return <Tag color="#1B55e3">{status}</Tag>;
    case 'DRAFT':
      return <Tag color="#6c757d">{status}</Tag>;
    case 'FAILED':
      return <Tag color="#dc3545">{status}</Tag>;
    case 'DELIVERED':
      return <Tag color="#28a745">{status}</Tag>;
    default:
      return <Tag color="#fd7e14">{status}</Tag>;
  }
};

const tabListNoTitle = [
  {
    key: 'averageStatistics',
    tab: 'Average',
  },
];

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('averageStatistics');
  const [searchName, setSearchName] = useState('');
  const singleCompany = useSelector(state => state.companies.singleCompany);
  const pools = useSelector(state => state.pools);
  const dispatch = useDispatch();
  const history = useHistory();
  const idFromUrl = history.location.pathname.split('/')[2];
  const [form] = Form.useForm();

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: companyAction.GET_COMPANY_REQUEST,
        payload: {
          id: idFromUrl,
        },
      });
    }, []);

    useEffect(() => {
      dispatch({
        type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
        payload: {
          companyId: idFromUrl,
          limit: constants.pools.itemsLoadingCount,
        },
      });
    }, []);
  };

  useFetching();

  const sendQuery = useCallback(
    query => {
      if (query || query === '') {
        dispatch({
          type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
          payload: {
            companyId: idFromUrl,
            limit: constants?.pools?.itemsLoadingCount,
            search: query,
          },
        });
      }
    },
    [dispatch, searchName, idFromUrl],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(event => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    const modalResultContacts = form.getFieldValue('results_contacts');
    dispatch({
      type: actions.UPDATE_USERS_REQUEST,
      payload: {
        id: singleCompany?.unique_id,
        results_contacts: [
          ...modalResultContacts,
          ...singleCompany?.results_contacts?.map(user => user.id),
        ],
      },
    });
    form.resetFields();
  }, [singleCompany]);

  const onModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Add User',
        onOk: handleSubmit,
        message: () => (
          <ContactResultModal
            form={form}
            existUsers={singleCompany?.results_contacts}
          />
        ),
        width: '40%',
      },
    });
  }, [handleSubmit, dispatch]);

  const onTabChange = useCallback(tabKey => {
    setActiveTab(tabKey);
  }, []);

  const removeUser = useCallback(
    userId => {
      dispatch({
        type: actions.UPDATE_USERS_REQUEST,
        payload: {
          id: singleCompany?.unique_id,
          results_contacts: singleCompany?.results_contacts
            ?.filter(({ id }) => id !== userId)
            .map(user => user.id),
        },
      });
    },
    [dispatch, singleCompany],
  );

  const loadMore = useCallback(() => {
    const idFromUrl = history.location.pathname.split('/')[2];
    dispatch({
      type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
      payload: {
        companyId: idFromUrl,
        limit: constants?.pools?.itemsLoadingCount,
        offset: pools.offset,
        search: searchName,
      },
    });
  }, [dispatch, pools, searchName]);

  const contactsColumns = [
    {
      title: 'Firstname',
      dataIndex: 'first_name',
    },
    {
      title: 'Lastname',
      dataIndex: 'last_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Confirmation status',
      dataIndex: 'verified',
      align: 'center',
      render: (_, record) =>
        record.verified ? (
          <Tag icon={<CheckCircleOutlined />} color="processing">
            Email confirmed
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Email not confirmed
          </Tag>
        ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Terms accepted',
      dataIndex: 'terms_accepted',
      align: 'center',
      render: (_, record) =>
        record.terms_accepted ? (
          <Tag icon={<CheckCircleOutlined />} color="processing">
            Terms accepted
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="volcano">
            Terms not accepted
          </Tag>
        ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'center',
      render: (value, user) => {
        return (
          <Button
            type="danger"
            ghost
            icon={<DeleteOutlined />}
            onClick={() =>
              dispatch({
                type: modalActions.SHOW_MODAL,
                modalType: 'WARNING_MODAL',
                modalProps: {
                  message: () => (
                    <>
                      <p className={styles.modalWarningMessage}>
                        You try to delete <span>{user.first_name}</span>{' '}
                        <span>{user.last_name}</span> from{' '}
                        <span>{singleCompany?.name}</span>.
                      </p>
                      <p className={styles.modalWarningMessage}>
                        Are you sure?
                      </p>
                    </>
                  ),
                  title: 'Confirm action',
                  onOk: () => removeUser(user.id),
                },
              })
            }
          />
        );
      },
    },
  ];

  const columns = [
    {
      title: 'SID',
      dataIndex: 'shortId',
    },
    {
      title: 'From number',
      dataIndex: 'fromNumber',
      render: (value, recipient) => {
        return recipient.campaign.fromNumber;
      },
    },
    {
      title: 'Name',
      dataIndex: 'username',
    },
    {
      title: 'To number',
      dataIndex: 'toNumber',
    },
    {
      title: 'Timezone',
      dataIndex: 'timezone',
      render: (value, recipient) => {
        return recipient.customer.timezone;
      },
    },
    {
      title: 'SMS body',
      dataIndex: 'smsBody',
    },
    {
      title: 'Status',
      dataIndex: 'deliveryStatus',
      render: status => {
        return getStatus(status);
      },
    },
    {
      title: 'Conversations',
      dataIndex: 'conversations',
      render: () => {
        return (
          <Link to="/conversations">
            <MessageOutlined />
          </Link>
        );
      },
    },
    {
      title: 'Deliver at',
      dataIndex: 'deliveryTime',
    },
    {
      title: 'Edited',
      dataIndex: 'updatedAt',
    },
    {
      title: 'Clicked At',
      dataIndex: 'clickedAt',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (value, recipient) => {
        return (
          <span className="d-flex">
            <Button type="danger" ghost icon={<DeleteOutlined />} />
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey={1}>
        <TabPane
          className={styles.campaignStatistics}
          tab="Results Contacts"
          key={1}
        >
          <Table
            columns={contactsColumns}
            dataSource={singleCompany?.results_contacts}
            scroll={{ x: 1200 }}
            loading={!singleCompany.isLoading}
            bordered
            pagination={{
              pageSize: singleCompany?.results_contacts?.length,
              hideOnSinglePage: true,
            }}
            title={() => (
              <span className="d-flex">
                <Button className="ml-auto mr-2" onClick={onModalToggle}>
                  Add contact
                </Button>
              </span>
            )}
            align="center"
          />
        </TabPane>
        <TabPane tab="Pools" key={2}>
          <Input
            size="middle"
            prefix={<SearchOutlined />}
            className={styles.search}
            placeholder="Search..."
            value={searchName}
            onChange={onChangeSearch}
          />
          <PoolTable loadMore={loadMore} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default CompanyProfile;
