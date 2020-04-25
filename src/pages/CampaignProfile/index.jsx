import React, { useCallback, useState } from 'react'
import { Tabs, Row, Col, Table, Card } from 'antd'
import Chart3 from 'components/widgets/Charts/3'
import General2 from 'components/widgets/General/2'
import General2v1 from 'components/widgets/General/2v1'
import General2v2 from 'components/widgets/General/2v2'
import General2v3 from 'components/widgets/General/2v3'

import styles from './styles.module.scss'

const { TabPane } = Tabs
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Campaign Name',
    dataIndex: 'name',
  },
  {
    title: 'Key',
    dataIndex: 'key',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Delivered',
    dataIndex: 'delivered',
  },
  {
    title: 'Clicks',
    dataIndex: 'clicks',
  },
  {
    title: 'Edited',
    dataIndex: 'edited',
  },
]
const tabListNoTitle = [
  {
    key: 'averageStatistics',
    tab: 'Average',
  },
];

const data = []
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
        <a className="btn btn-success align-self-start text-nowrap" href="javascript: void(0);">
          Edit
        </a>
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
          <Table columns={columns} dataSource={data} scroll={{ x: 1200 }} bordered align="center" />
        </TabPane>
      </Tabs>
    </>
  )
}

export default CampaignProfile
