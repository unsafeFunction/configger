import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Tabs, Row, Col, Table, Card, Tag, Button, Skeleton } from 'antd';
import Chart3 from 'components/widgets/Charts/3';
import General2 from 'components/widgets/General/2';
import General2v1 from 'components/widgets/General/2v1';
import General2v2 from 'components/widgets/General/2v2';
import General2v3 from 'components/widgets/General/2v3';
import {
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { RecipientModal } from 'components/widgets/recipients';
import modalActions from 'redux/modal/actions';
import actions from 'redux/recipients/actions';
import campaignAction from 'redux/campaigns/actions';
import companyAction from 'redux/companies/actions';
import { get } from 'lodash';
import { moment } from 'moment';
import styles from './styles.module.scss';
import Pools from 'pages/pools';
import { default as poolsActions } from 'redux/pools/actions';

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

const CampaignProfile = () => {
  const [activeTab, setActiveTab] = useState('averageStatistics');
  const singleCompany = useSelector(state => state.companies.singleCompany);
  const recipients = useSelector(state => state.recipients.all);
  const dispatch = useDispatch();
  const history = useHistory();

  const useFetching = () => {
    const idFromUrl = history.location.pathname.split('/')[2];
    useEffect(() => {
      // if (!singleCampaign.id) {
      //   dispatch({
      //     type: campaignAction.ON_CAMPAIGN_DATA_CHANGE,
      //     payload: {
      //       name: 'id',
      //       value: idFromUrl,
      //     },
      //   });
      // }
      //
      // dispatch({
      //   type: actions.LOAD_RECIPIENTS_REQUEST,
      //   payload: {
      //     campaignId: singleCampaign.id || idFromUrl,
      //   },
      // });
      //
      // dispatch({
      //   type: campaignAction.GET_CAMPAIGN_STATISTICS_REQUEST,
      //   payload: {
      //     campaignId: singleCampaign.id || idFromUrl,
      //   },
      // });

      dispatch({
        type: companyAction.GET_COMPANY_REQUEST,
        payload: {
          id: idFromUrl,
        },
      });
    }, []);

    useEffect(() => {
      // const params =
      //   from && to
      //     ? { from: from, to: to, limit: runsPage.defaultLoadingNumber }
      //     : { limit: runsPage.defaultLoadingNumber };
      // console.log('params', params);
      dispatch({
        type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
        payload: {
          // ...params,
          companyId: idFromUrl,
          // limit: runsPage.defaultLoadingNumber,
        },
      });
    }, []);
  };

  useFetching();

  const createRecipient = useCallback(() => {
    dispatch({
      type: actions.CREATE_RECIPIENT_REQUEST,
      payload: {
        campaignId:
          singleCompany.unique_id || history.location.pathname.split('/')[2],
      },
    });
  }, [dispatch, singleCompany]);

  const onChange = useCallback(
    event => {
      const { value, name } = event.target;

      dispatch({
        type: actions.ON_RECIPIENT_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch],
  );

  const onSelectChange = useCallback(
    (value, { name }) => {
      dispatch({
        type: actions.ON_RECIPIENT_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch],
  );

  const onPickerChange = useCallback(
    value => {
      dispatch({
        type: actions.ON_RECIPIENT_DATA_CHANGE,
        payload: {
          name: 'deliveryTime',
          value,
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'CONFIRM_MODAL',
      modalProps: {
        title: 'Add recipient',
        confirmAction: () => {},
        onCancel: () => {},
        onOk: createRecipient,
        message: () => (
          <RecipientModal
            onSelectChange={onSelectChange}
            onChange={onChange}
            singleCampaign={singleCompany}
            onPickerChange={onPickerChange}
          />
        ),
        type: 'danger',
        width: 820,
        bodyStyle: {
          padding: '0',
        },
      },
    });
  }, [createRecipient, dispatch, onChange, onSelectChange]);

  const updateRecipient = useCallback(() => {
    dispatch({
      type: actions.PUT_RECIPIENT_REQUEST,
    });
  }, [dispatch]);

  const onEditModalToggle = useCallback(
    id => {
      dispatch({
        type: actions.GET_RECIPIENT_REQUEST,
        payload: {
          id,
        },
      });
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'CONFIRM_MODAL',
        modalProps: {
          title: 'Add recipient',
          confirmAction: () => {},
          onCancel: () => {},
          onOk: updateRecipient,
          message: () => (
            <RecipientModal
              onSelectChange={onSelectChange}
              onChange={onChange}
              singleCampaign={singleCompany}
              onPickerChange={onPickerChange}
            />
          ),
          type: 'danger',
          width: 820,
          bodyStyle: {
            padding: '0',
          },
        },
      });
    },
    [createRecipient, dispatch, onChange, onSelectChange],
  );

  const onTabChange = useCallback(tabKey => {
    setActiveTab(tabKey);
  }, []);

  const onPageChange = page => {
    dispatch({
      type: actions.LOAD_RECIPIENTS_REQUEST,
      payload: {
        page,
        campaignId:
          singleCompany.unique_id || history.location.pathname.split('/')[2],
      },
    });
  };

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
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Terms accepted',
      dataIndex: 'terms_accepted',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (value, recipient) => {
        return (
          <span className="d-flex">
            <Button
              type="primary"
              ghost
              className="mr-2"
              onClick={() => onEditModalToggle(recipient.id)}
              icon={<EditOutlined />}
            />
            <Button type="danger" ghost icon={<DeleteOutlined />} />
          </span>
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
            <Button
              type="primary"
              ghost
              className="mr-2"
              onClick={() => onEditModalToggle(recipient.id)}
              icon={<EditOutlined />}
            />
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
            dataSource={singleCompany.results_contacts}
            scroll={{ x: 1200 }}
            loading={!singleCompany.isLoading}
            bordered
            pagination={{
              pageSize: singleCompany.results_contacts.length,
              hideOnSinglePage: true,
            }}
            title={() => (
              <span className="d-flex">
                <Button icon={<ImportOutlined />} className="ml-auto mr-2" />
                <Button onClick={onModalToggle}>Add contact</Button>
              </span>
            )}
            align="center"
          />
        </TabPane>
        <TabPane tab="Pools" key={2}>
          <Pools />
        </TabPane>
      </Tabs>
    </>
  );
};

export default CampaignProfile;
