import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Tabs, Row, Col, Table, Card, Tag, Button, Spin } from 'antd';
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
import actions from 'redux/recipients/actions';
import { get } from 'lodash';
import styles from './styles.module.scss';

const { TabPane } = Tabs;
const columns = [
  {
    title: 'SID',
    dataIndex: 'shortId',
  },
  {
    title: 'From Number',
    dataIndex: 'fromNumber',
    render: (value, recipient) => {
      return recipient.campaign.fromNumber;
    },
  },
  {
    title: 'Username',
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
    title: 'Deliver at',
    dataIndex: 'deliveryTime',
  },
  {
    title: 'Custom SMS Body',
    dataIndex: 'smsBody',
  },
  {
    title: 'Status',
    dataIndex: 'deliveryStatus',
  },
  {
    title: 'Conversations',
    dataIndex: 'conversations',
    render: () => {
      return (
        <Link to="/conversations">
          <span className="mr-1">2</span>
          <MessageOutlined />
        </Link>
      );
    },
  },
  {
    title: 'Updated at',
    dataIndex: 'updatedAt',
  },
  {
    title: 'Opened At',
    dataIndex: 'clickedAt',
  },
  {
    title: 'actions',
    dataIndex: 'actions',
    render: () => {
      return (
        <span className="d-flex">
          <Button
            type="primary"
            ghost
            className="mr-2"
            icon={<EditOutlined />}
          />
          <Button type="danger" ghost icon={<DeleteOutlined />} />
        </span>
      );
    },
  },
];
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
    useEffect(() => {
      dispatch({
        type: actions.LOAD_RECIPIENTS_REQUEST,
        payload: {
          campaignId:
            singleCampaign.id || history.location.pathname.split('/')[2],
        },
      });
    }, []);
  };

  useFetching();

  const onTabChange = useCallback(tabKey => {
    setActiveTab(tabKey);
  }, []);

  const recipient = recipients.items[0];
  if (!recipients.isLoading) {
    return <Spin />;
  }
  return (
    <>
      <div className="d-flex flex-xs-wrap pb-4">
        <div className="mr-auto pr-3">
          <div className="text-dark font-size-24 font-weight-bold mb-2">
            {recipients.isLoading && get(recipient, 'campaign.smsBody', '-')}
          </div>
          <div className="mb-3">
            <span className="mr-3 text-uppercase badge badge-success">
              In progress
            </span>
            <a className="font-weight-bold mr-2" href="javascript: void(0);">
              SMS 20SF | FEMALE | 35 - 40 |
            </a>
            <a className="font-weight-bold mr-2">From number</a>
            <a className="font-weight-bold mr-2">
              {`[${
                get(recipient, 'campaign.conversationEnabled', false)
                  ? 'On'
                  : 'Off'
              }] Conversations`}
            </a>
            <a className="font-weight-bold mr-2">
              {`[${
                get(recipient, 'campaign.trackingEnabled', false) ? 'On' : 'Off'
              }]  Click tracking`}
            </a>
          </div>
        </div>

        <Button icon={<EditOutlined />}>Edit</Button>
      </div>
      <Tabs defaultActiveKey={1}>
        <TabPane className={styles.campaignStatistics} tab="Summary" key={1}>
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
                <Chart3 />
              </Card>
            </Col>
            <Col span="7">
              <div className="card">
                <div className="card-body">
                  <General2v3 />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <General2 />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <General2v1 />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <General2v2 />
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Recipients" key={2}>
          <Table
            columns={columns}
            dataSource={recipients.items}
            scroll={{ x: 1200 }}
            bordered
            title={() => (
              <span className="d-flex">
                <Button icon={<ImportOutlined />} className="ml-auto mr-2" />
                <Button>Add recipient</Button>
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
