import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames';
import { Table, Tag, Button, Modal } from 'antd'
import { CampaignModal } from 'components/widgets/campaigns';
import { PlusCircleOutlined } from '@ant-design/icons';
import actions from 'redux/campaigns/actions'

import styles from './styles.module.scss'

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
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 46; i++) {
  data.push({
    id: i,
    key: `$SMS 20SF | FEMALE | ${i} - ${i+1}`,
    name: `Campaign SMS offer 2${i}`,
    status: <Tag color="volcano">status</Tag>,
    delivered: `${i} %`,
    clicks: `${i} %`,
    edited: `${i} minutes ago`,
  })
}

const Campaigns = () => {
  const [isModalOpen, onModalOpen] = useState(false);

  const onModalToggle = useCallback(()=>{
    onModalOpen(!isModalOpen)
  }, [isModalOpen])

  const dispatchCampaignData = useDispatch();

  const onChange = (event) => {
    const { value, name } = event.target;

    dispatchCampaignData({type: actions.ON_CAMPAIGN_DATA_CHANGE, payload: {
      name,
      value
    }})
  }

  return (
    <>
      <div className={classNames("air__utils__heading", styles.page__header)}>
        <h4>Campaign</h4>
        <Button
          onClick={onModalToggle}
          icon={<PlusCircleOutlined />}
          type="primary"
        >
            Create Campaign
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1200 }}
        bordered
        align="center"
      />
      <Modal
        title="Create Campaign"
        visible={isModalOpen}
        onCancel={onModalToggle}
        width={820}
      >
        <CampaignModal onChange={onChange} />
      </Modal>
    </>

  )
}

export default Campaigns
