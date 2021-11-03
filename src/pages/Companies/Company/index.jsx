import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Space, Table, Tabs, Tag } from 'antd';
import { ContactResultModal } from 'components/widgets/companies';
import PoolTable from 'components/widgets/Pools/PoolTable';
import useWindowSize from 'hooks/useWindowSize';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';
import { default as poolsActions } from 'redux/pools/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const { TabPane } = Tabs;

const CompanyProfile = () => {
  const [searchName, setSearchName] = useState('');
  const singleCompany = useSelector((state) => state.companies.singleCompany);
  const pools = useSelector((state) => state.pools);
  const dispatch = useDispatch();
  const history = useHistory();
  const idFromUrl = history.location.pathname.split('/')[2];
  const [form] = Form.useForm();
  const { isMobile } = useWindowSize();

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.GET_COMPANY_REQUEST,
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
    (query) => {
      dispatch({
        type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
        payload: {
          companyId: idFromUrl,
          limit: constants?.pools?.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch, searchName, idFromUrl],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback((event) => {
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
          ...singleCompany?.results_contacts?.map((user) => user.id),
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
        title: 'Add Results Contact',
        onOk: handleSubmit,
        cancelButtonProps: { className: styles.modalButton },
        okButtonProps: {
          className: styles.modalButton,
        },
        message: () => (
          <ContactResultModal
            form={form}
            existUsers={singleCompany?.results_contacts}
          />
        ),
      },
    });
  }, [handleSubmit, dispatch]);

  const removeUser = useCallback(
    (userId) => {
      dispatch({
        type: actions.UPDATE_USERS_REQUEST,
        payload: {
          id: singleCompany?.unique_id,
          results_contacts: singleCompany?.results_contacts
            ?.filter(({ id }) => id !== userId)
            .map((user) => user.id),
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
      title: 'Full name',
      dataIndex: 'fullname',
      render: (_, record) => (
        <Link to={`/users/${record.id}`} className="text-blue">
          {record.first_name} {record.last_name}
        </Link>
      ),
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
      fixed: 'right',
      dataIndex: 'actions',
      align: 'center',
      width: isMobile ? 100 : 150,
      render: (value, user) => {
        return (
          <Space size="middle">
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
          </Space>
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
            pagination={{
              pageSize: singleCompany?.results_contacts?.length,
              hideOnSinglePage: true,
            }}
            title={() => (
              <span className="d-flex">
                <Button className="ml-auto mr-2" onClick={onModalToggle}>
                  Add Results Contact
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
