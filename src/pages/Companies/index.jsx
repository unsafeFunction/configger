import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Table, Button, Tag } from 'antd';
import { CampaignModal } from 'components/widgets/campaigns';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';

import styles from './styles.module.scss';

const Companies = () => {
  const dispatchCompaniesData = useDispatch();

  const allCompanies = useSelector(state => state.companies.all);
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
      dispatchCompaniesData({
        type: actions.REMOVE_CAMPAIGN_REQUEST,
        payload: {
          id,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const setCampaignId = useCallback(
    value => {
      dispatchCompaniesData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name: 'id',
          value,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const createCampaign = useCallback(() => {
    dispatchCompaniesData({
      type: actions.CREATE_CAMPAIGN_REQUEST,
      payload: {},
    });
  }, [dispatchCompaniesData, singleCampaign]);

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
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
      title: 'Short Name',
      dataIndex: 'name_short',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Company Id',
      dataIndex: 'company_id',
      render: value => {
        return value || '-';
      },
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (action, company) => {
        return (
          <Button
            type="danger"
            ghost
            icon={<DeleteOutlined />}
            onClick={() =>
              dispatchCompaniesData({
                type: modalActions.SHOW_MODAL,
                modalType: 'WARNING_MODAL',
                modalProps: {
                  message: () => (
                    <h4>{`You try to delete ${company.name}. Are you sure?`}</h4>
                  ),
                  title: 'Remove campaign',
                  onOk: () => removeCampaign(company.id),
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

      dispatchCompaniesData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const onSelectChange = useCallback(
    (value, { name }) => {
      dispatchCompaniesData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const onSwitchChange = useCallback(
    (value, event) => {
      const { name } = event.target;
      dispatchCompaniesData({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatchCompaniesData],
  );

  const useFetching = () => {
    useEffect(() => {
      dispatchCompaniesData({
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: 25,
          offset: 0,
        },
      });
    }, []);
  };

  const onPageChange = page => {
    dispatchCompaniesData({
      type: actions.LOAD_CAMPAIGN_REQUEST,
      payload: {
        page,
      },
    });
  };

  useFetching();

  const onModalToggle = useCallback(() => {
    dispatchCompaniesData({
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
  }, [createCampaign, dispatchCompaniesData, onChange, onSelectChange]);

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Companies</h4>
        <Button
          onClick={onModalToggle}
          icon={<PlusCircleOutlined />}
          type="primary"
        >
          Create Company
        </Button>
      </div>
      <Table
        dataSource={allCompanies.items}
        columns={columns}
        scroll={{ x: 1200 }}
        bordered
        loading={!allCompanies.isLoading}
        align="center"
        pagination={{ pageSize: 25, hideOnSinglePage: true }}
      />
    </>
  );
};

export default Companies;
