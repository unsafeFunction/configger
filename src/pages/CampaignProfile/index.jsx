import React, { useCallback, useState } from 'react'
import { Tabs, Row, Col, Table, Card , Tag, Button} from 'antd'
import Chart3 from 'components/widgets/Charts/3'
import General2 from 'components/widgets/General/2'
import General2v1 from 'components/widgets/General/2v1'
import General2v2 from 'components/widgets/General/2v2'
import General2v3 from 'components/widgets/General/2v3'
import { EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';

import styles from './styles.module.scss'

const { TabPane } = Tabs
const columns = [
  {
    title: 'SID',
    dataIndex: 'sid',
  },
  {
    title: 'From Number',
    dataIndex: 'fromNumber',
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
  },
  {
    title: 'Deliver at',
    dataIndex: 'deliverAt',
  },
  {
    title: 'Custom SMS Body',
    dataIndex: 'smsBody',
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Conversations',
    dataIndex: 'conversations'
  },
  {
    title: 'Updated at',
    dataIndex: 'updatedAt',
  },
  {
    title: 'Opened At',
    dataIndex: 'openedAt'
  },
  {
    title: 'actions',
    dataIndex: 'actions'
  }
]
const tabListNoTitle = [
  {
    key: 'averageStatistics',
    tab: 'Average',
  },
];

const data = []
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 46; i++) {
  data.push({
    sid: i,
    fromNumber: "+1 415 993 8030",
    username: "Yellow systems",
    toNumber: "+1 415 993 8030",
    timezone: "Time zone in Minsk (GMT+3)",
    deliverAt: '2:00 AM',
    smsBody: ' Lorem ipsum dolor sit amet',
    status: i % 2 !== 0 ? <Tag color="#87d068">Draft</Tag> : <Tag color="#2db7f5">Pending</Tag>,
    conversations: 2,
    actions:
  <span className="d-flex">
    <Button type="primary" ghost className="mr-2" icon={<EditOutlined />}>
        Edit
    </Button>
    <Button type="danger" ghost icon={<DeleteOutlined />}>
        Delete
    </Button>
  </span>
  })
}

const CampaignProfile = () => {
  const [activeTab, setActiveTab] = useState('averageStatistics')

  const onTabChange = useCallback(
    (tabKey) => {
      setActiveTab(tabKey)
    },
    [],
  )
  return (
    <>
      <div className="d-flex flex-xs-wrap pb-4">
        <div className="mr-auto pr-3">
          <div className="text-dark font-size-24 font-weight-bold mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam ut ex aliquam
            imperdiet eu at justo. Lorem ipsum dolor sit amet, consectetur massa nunc.
          </div>
          <div className="mb-3">
            <span className="mr-3 text-uppercase badge badge-success">In progress</span>
            <a className="font-weight-bold" href="javascript: void(0);">
              SMS 20SF | FEMALE | 0 - 1
            </a>
          </div>
        </div>
        <Button icon={<EditOutlined />}>
          Edit
        </Button>
      </div>
      <Tabs defaultActiveKey={1}>
        <TabPane className={styles.campaignStatistics} tab="Summary" key={1}>
          <Row>
            <Col span="16">
              <Card
                tabList={tabListNoTitle}
                activeTabKey={activeTab}
                onTabChange={key => { onTabChange(key) }}
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
            dataSource={data}
            scroll={{ x: 1200 }}
            bordered
            title={()=>(
              <span className="d-flex">
                <Button icon={<ImportOutlined />} className="ml-auto mr-2">Import</Button>
                <Button>Add recipient</Button>
              </span>
            )
            }
            align="center"
          />
        </TabPane>
      </Tabs>
    </>
  )
}

export default CampaignProfile
