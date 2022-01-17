import {
  DownOutlined,
  EditOutlined,
  IdcardOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Menu,
  notification,
  Row,
  Statistic,
  Tabs,
  Tooltip,
} from 'antd';
import PoolTableByDays from 'components/widgets/Pools/PoolTableByDays';
import SyncModal from 'components/widgets/Pools/SyncModal';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from 'redux/companies/actions';
import modalActions from 'redux/modal/actions';
import { default as poolsActions } from 'redux/pools/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const { TabPane } = Tabs;

const CompanyProfile = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const singleCompany = useSelector((state) => state.companies.singleCompany);
  const pools = useSelector((state) => state.pools.allByDays);
  const dispatch = useDispatch();
  const history = useHistory();
  const idFromUrl = history.location.pathname.split('/')[2];
  const [syncForm] = Form.useForm();

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.GET_COMPANY_REQUEST,
        payload: {
          id: idFromUrl,
        },
      });
    }, []);

    useEffect(() => {
      dispatch({
        type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
        payload: {
          companyId: idFromUrl,
          limit: constants.poolsByCompany.itemsLoadingCount,
        },
      });
    }, []);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: poolsActions.FETCH_POOLS_BY_COMPANY_ID_REQUEST,
      payload: {
        companyId: idFromUrl,
        limit: constants?.poolsByCompany?.itemsLoadingCount,
        offset: pools.offset,
        search: searchName,
      },
    });
  }, [dispatch, pools, searchName, idFromUrl]);

  const formatStatBlock = ({ value, link }) => (
    <Tooltip title={value} placement="topLeft">
      {link ? (
        <a href={value} target="_blank">
          {value}
        </a>
      ) : (
        value
      )}
    </Tooltip>
  );

  const handleSync = useCallback(async () => {
    const fieldValues = await syncForm.validateFields();
    return dispatch({
      type: poolsActions.SYNC_POOLS_REQUEST,
      payload: {
        poolIds: selectedRowKeys,
        companyId: singleCompany.id,
        ...fieldValues,
        closeBtn: (key) => (
          <Button
            type="primary"
            size="small"
            onClick={() => notification.close(key)}
          >
            GOT IT
          </Button>
        ),
      },
    });
  }, [selectedRowKeys]);

  const handleModalSync = useCallback(
    (record) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Sync options',
          cancelButtonProps: { className: styles.modalButton },
          okButtonProps: {
            className: styles.modalButton,
          },
          onOk: handleSync,
          okText: 'Sync',
          message: () => <SyncModal form={syncForm} />,
        },
      });
    },
    [dispatch, handleSync],
  );

  const menu = (record) => (
    <Menu>
      <Menu.Item
        onClick={handleModalSync}
        key="1"
        disabled={!selectedRowKeys.length}
      >
        Sync with Google Sheets
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row className="mb-3" gutter={16}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCart}>
            <Statistic
              className={styles.locationName}
              title="Short name"
              value={singleCompany?.name_short || '-'}
              formatter={(value) => formatStatBlock({ value })}
              prefix={<EditOutlined className={styles.statisticIcon} />}
              loading={!singleCompany.isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCart}>
            <Statistic
              className={styles.locationName}
              title="Company id"
              value={singleCompany?.company_id || '-'}
              formatter={(value) => formatStatBlock({ value })}
              prefix={<IdcardOutlined className={styles.statisticIcon} />}
              loading={!singleCompany.isLoading}
            />
          </Card>
        </Col>
        {singleCompany.gdrive_enabled && (
          <Col xs={24} sm={8}>
            <Card className={styles.statCart}>
              <Statistic
                className={styles.locationName}
                title="Google Drive sheet link"
                value={singleCompany?.gdrive_sheet_url || '-'}
                formatter={(value) =>
                  formatStatBlock({
                    value,
                    link: !!singleCompany?.gdrive_sheet_url,
                  })
                }
                prefix={<LinkOutlined className={styles.statisticIcon} />}
                loading={!singleCompany.isLoading}
              />
            </Card>
          </Col>
        )}
      </Row>
      <Tabs defaultActiveKey={1}>
        <TabPane tab="Pools" key={1}>
          {singleCompany.gdrive_enabled && (
            <div className="d-flex">
              <Dropdown className="ml-auto" overlay={menu()}>
                <Button type="primary">
                  Actions
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          )}
          <PoolTableByDays
            gdriveEnabled={singleCompany.gdrive_enabled}
            loadMore={loadMore}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default CompanyProfile;
