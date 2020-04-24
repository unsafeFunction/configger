import React from 'react'
import { Tabs, Row, Col, Table } from 'antd'
import Chart3 from 'components/widgets/Charts/3'
import General2 from 'components/widgets/General/2'
import General2v1 from 'components/widgets/General/2v1'
import General2v2 from 'components/widgets/General/2v2'
import General2v3 from 'components/widgets/General/2v3'
// import { Link } from 'react-router-dom'
// import classNames from 'classnames'
// import { Table } from 'antd'
// import CampaignChart from 'components/widgets/campaigns/CampaignChart';
// import actions from 'redux/campaigns/actions'

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

const data = []
const CampaignProfile = () => {
  return (
    <>
      <div className="d-flex flex-xs-wrap pb-4">
        <div className="mr-auto pr-3">
          <div className="text-dark font-size-24 font-weight-bold mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam ut ex aliquam imperdiet eu at justo.
          Lorem ipsum dolor sit amet, consectetur massa nunc.
          </div>
          <div className="mb-3">
            <span className="mr-3 text-uppercase badge badge-success">Open</span>
            <a className="font-weight-bold" href="javascript: void(0);">
                zxs2162
            </a>
              wrote this issue 12 days ago · 0 comments
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
              <div className="card-body">
                <Chart3 />
              </div>
            </Col>
            <Col span="7">
              <div className="card text-white bg-success">
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
