import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Table, Button, Tag } from 'antd';
import { CampaignModal } from 'components/widgets/campaigns';
import { PlusCircleOutlined } from '@ant-design/icons';
import actions from 'redux/campaigns/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss'

const Campaigns = () => {
  const dispatchCampaignData = useDispatch()

  const allCampaigns = useSelector(state=>state.campaigns.all)

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      render: (name, campaign)=>{
        return <Link to={`/campaigns/${campaign.id}`}>{`${name}-${campaign.id}`}</Link>
      }
    },
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
       return <Tag color="#6c757d">{status}</Tag>
      }
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
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (action, campaign)=>{
          return (
            <Button
              onClick={()=>dispatchCampaignData({
                type: modalActions.SHOW_MODAL,
                modalType: 'WARNING_MODAL',
                modalProps: {
                  message: () => <h4>{`You try to delete ${campaign.name}. Are you sure?`}</h4>,
                  title: "Remove campaign"
                }}
              )}
            >
              {action}
            </Button>
          )
      }
    }
  ]

  const onChange = useCallback(
    event => {
      const { value, name } = event.target

      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      })
    },
    [dispatchCampaignData],
  )
    const useFetching = () => {
      useEffect(()=>{
        dispatchCampaignData({
          type: actions.LOAD_CAMPAIGN_SUCCESS
        })
      }, [])
    }

    useFetching();

  const onSelectChange = useCallback(
    value => {
      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name: 'deeplink',
          value,
        },
      })
    },
    [dispatchCampaignData],
  )

  const onModalToggle = useCallback(() => {
    dispatchCampaignData({
      type: modalActions.SHOW_MODAL,
      modalType: "CONFIRM_MODAL",
      modalProps: {
        title: 'Create campaign',
        confirmAction: () => {},
        onCancel: onModalToggle,
        message: () =>  <CampaignModal onSelectChange={onSelectChange} onChange={onChange} />,
        type: 'danger',
        width: 820,
        bodyStyle:{
          padding: "0"
        }
      }
    })
  }, [dispatchCampaignData, onChange, onSelectChange])

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Campaign</h4>
        <Button onClick={onModalToggle} icon={<PlusCircleOutlined />} type="primary">
          Create Campaign
        </Button>
      </div>
      <Table
        dataSource={allCampaigns.items}
        columns={columns}
        scroll={{ x: 1200 }}
        bordered
        align="center"
      />
      {/* <Modal
        bodyStyle={{
        padding: "0"
      }}
        title="Create Campaign"
        visible={isModalOpen}
        onCancel={onModalToggle}
        width={820}
        confirmLoading={!allCampaigns.isLoading}
      >
      </Modal> */}
    </>
  )
}

export default Campaigns
