import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag } from 'antd';
import { CampaignModal } from 'components/widgets/campaigns';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import actions from 'redux/user/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss';

const Campaigns = () => {
  const dispatchCampaignData = useDispatch();

  const allCampaigns = useSelector(state => state.campaigns.all);
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);

  const getStatus = status => {
    switch (status) {
      case 'COMPLETED':
        return <Tag color="#32CD32">{status}</Tag>;
      case 'SCHEDULED':
        return <Tag color="#1B55e3">{status}</Tag>;
      case 'DRAFT':
        return <Tag color="#6c757d">{status}</Tag>;
      case 'DELIVERED':
        return <Tag color="#28a745">{status}</Tag>;
      case 'FAILED':
        return <Tag color="#dc3545">{status}</Tag>;
      default:
        return <Tag color="#fd7e14">{status}</Tag>;
    }
  };

  const removeCampaign = useCallback(
    id => {
      dispatchCampaignData({
        type: actions.REMOVE_CAMPAIGN_REQUEST,
        payload: {
          id,
        },
      });
    },
    [dispatchCampaignData],
  );

  const setCampaignId = useCallback(
    value => {
      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name: 'id',
          value,
        },
      });
    },
    [dispatchCampaignData],
  );

  const createCampaign = useCallback(() => {
    dispatchCampaignData({
      type: actions.CREATE_CAMPAIGN_REQUEST,
      payload: {},
    });
  }, [dispatchCampaignData, singleCampaign]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (value, campaign) => {
        return (
          <Link
            onClick={() => {
              setCampaignId(campaign.id);
            }}
            to={`/campaigns/${campaign.id}`}
          >
            {`${value.split('-')[0] || '-'}`}
          </Link>
        );
      },
    },
    {
      title: 'Campaign Name',
      dataIndex: 'title',
      render: (name, campaign) => {
        return (
          <Link
            onClick={() => {
              setCampaignId(campaign.id);
            }}
            to={`/campaigns/${campaign.id}`}
          >
            {`${name || '-'}`}
          </Link>
        );
      },
    },
    {
      title: 'Key',
      dataIndex: 'key',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => {
        return getStatus(status) || '-';
      },
    },
    {
      title: 'Delivered %',
      dataIndex: 'delivered',
      render: value => {
        return `${value || '0'} %`;
      },
    },
    {
      title: 'Clicks',
      dataIndex: 'clicked',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Edited',
      dataIndex: 'updatedAt',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (action, campaign) => {
        return (
          <Button
            type="danger"
            ghost
            icon={<DeleteOutlined />}
            onClick={() =>
              dispatchCampaignData({
                type: modalActions.SHOW_MODAL,
                modalType: 'WARNING_MODAL',
                modalProps: {
                  message: () => (
                    <h4>{`You try to delete ${campaign.name}. Are you sure?`}</h4>
                  ),
                  title: 'Remove campaign',
                  onOk: () => removeCampaign(campaign.id),
                },
              })
            }
          />
        );
      },
    },
  ];

  const onChange = useCallback(
    event => {
      const { value, name } = event.target;

      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCampaignData],
  );

  const onSelectChange = useCallback(
    (value, { name }) => {
      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCampaignData],
  );

  const onSwitchChange = useCallback(
    (value, event) => {
      const { name } = event.target;
      dispatchCampaignData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCampaignData],
  );

  const useFetching = () => {
    useEffect(() => {
      dispatchCampaignData({
        type: actions.LOAD_USERS_REQUEST,
        payload: {
          page: 1,
        },
      });
    }, []);
  };

  const onPageChange = page => {
    dispatchCampaignData({
      type: actions.LOAD_CAMPAIGN_REQUEST,
      payload: {
        page,
      },
    });
  };

  useFetching();

  const onModalToggle = useCallback(() => {
    dispatchCampaignData({
      type: modalActions.SHOW_MODAL,
      modalType: 'CONFIRM_MODAL',
      modalProps: {
        title: 'Create campaign',
        confirmAction: () => {},
        onCancel: onModalToggle,
        onOk: createCampaign,
        message: () => (
          <CampaignModal
            onSwitchChange={onSwitchChange}
            onSelectChange={onSelectChange}
            onChange={onChange}
            singleCampaign={singleCampaign}
          />
        ),
        type: 'danger',
        width: 820,
        bodyStyle: {
          padding: '0',
        },
      },
    });
  }, [createCampaign, dispatchCampaignData, onChange, onSelectChange]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Campaigns</h4>
        <Button
          onClick={onModalToggle}
          icon={<PlusCircleOutlined />}
          type="primary"
        >
          Create Campaign
        </Button>
      </div>
      <Table
        dataSource={allCampaigns.items}
        columns={columns}
        scroll={{ x: 1200 }}
        bordered
        loading={!allCampaigns.isLoading}
        align="center"
        pagination={{ total: allCampaigns.total, onChange: onPageChange }}
      />
    </>
  );
};

export default Campaigns;
