import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

class List2 extends React.Component {
  render() {
    return (
      <div>
        <Tabs className="air-tabs-bordered" defaultActiveKey="1">
          <TabPane tab="Actions" key="3">
            <div className="py-2 pb-4">No Actions</div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default List2
