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
import { get } from 'lodash';
import { moment } from 'moment';
import styles from './styles.module.scss';

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
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);
  const recipients = useSelector(state => state.recipients.all);
  const dispatch = useDispatch();
  const history = useHistory();

  const useFetching = () => {
    const idFromUrl = history.location.pathname.split('/')[2];
    useEffect(() => {
      if (!singleCampaign.id) {
        dispatch({
          type: campaignAction.ON_CAMPAIGN_DATA_CHANGE,
          payload: {
            name: 'id',
            value: idFromUrl,
          },
        });
      }

      dispatch({
        type: actions.LOAD_RECIPIENTS_REQUEST,
        payload: {
          campaignId: singleCampaign.id || idFromUrl,
        },
      });

      dispatch({
        type: campaignAction.GET_CAMPAIGN_STATISTICS_REQUEST,
        payload: {
          campaignId: singleCampaign.id || idFromUrl,
        },
      });

      dispatch({
        type: campaignAction.GET_CAMPAIGN_REQUEST,
        payload: {
          id: singleCampaign.id || idFromUrl,
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
          singleCampaign.id || history.location.pathname.split('/')[2],
      },
    });
  }, [dispatch, singleCampaign]);

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
            singleCampaign={singleCampaign}
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
              singleCampaign={singleCampaign}
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
          singleCampaign.id || history.location.pathname.split('/')[2],
      },
    });
  };

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
      title: 'Updated at',
      dataIndex: 'updatedAt',
    },
    {
      title: 'Opened at',
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
      <div className="d-flex flex-xs-wrap pb-4">
        {!singleCampaign.isLoading ? (
          <Skeleton active />
        ) : (
          <div className="mr-auto pr-3">
            <div className="text-dark font-size-24 font-weight-bold mb-2">
              {get(singleCampaign, 'smsBody')}
            </div>
            <div className="mb-3">
              {getStatus(singleCampaign.status)}
              <a className="font-weight-bold mr-2" href="javascript: void(0);">
                {`${singleCampaign.id.split('-')[0]} | FEMALE | 35 - 40 |`}
              </a>
              <a className="font-weight-bold mr-2">{`From number: ${singleCampaign?.fromNumber}`}</a>
              <a className="font-weight-bold mr-2">
                {`[${
                  get(singleCampaign, 'conversationEnabled', false)
                    ? 'On'
                    : 'Off'
                }] Conversations`}
              </a>
              <a className="font-weight-bold mr-2">
                {`[${
                  get(singleCampaign, 'trackingEnabled', false) ? 'On' : 'Off'
                }]  Click tracking`}
              </a>
            </div>
          </div>
        )}

        <Button icon={<EditOutlined />}>Edit</Button>
      </div>
      <Tabs defaultActiveKey={1}>
        <TabPane className={styles.campaignStatistics} tab="Summary" key={1}>
          {!singleCampaign.isLoading ? (
            <Skeleton active />
          ) : (
            <Row>
              <Col span="16">
                <Card
                  tabList={tabListNoTitle}
                  activeTabKey={activeTab}
                  onTabChange={key => {
                    onTabChange(key);
                  }}
                  className="mr-3"
                >
                  <Chart3 statistics={singleCampaign.statistics} />
                </Card>
              </Col>
              <Col span="7">
                <div className="card">
                  <div className="card-body">
                    <General2v3 statistics={singleCampaign.statistics} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <General2 statistics={singleCampaign.statistics} />
                  </div>
                </div>
                {/* <div className="card">
                  <div className="card-body">
                    <General2v1 statistics={singleCampaign.statistics} />
                  </div>
                </div> */}
                <div className="card">
                  <div className="card-body">
                    <General2v2 statistics={singleCampaign.statistics} />
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </TabPane>
        <TabPane tab="Recipients" key={2}>
          <Table
            columns={columns}
            dataSource={recipients.items}
            scroll={{ x: 1200 }}
            loading={recipients.isLoading}
            bordered
            pagination={{
              total: recipients.total,
              onChange: onPageChange,
            }}
            title={() => (
              <span className="d-flex">
                <Button icon={<ImportOutlined />} className="ml-auto mr-2" />
                <Button
                  disabled={singleCampaign.status !== 'DRAFT'}
                  onClick={onModalToggle}
                >
                  Add recipient
                </Button>
              </span>
            )}
            align="center"
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default CampaignProfile;
