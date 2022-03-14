/* eslint-disable camelcase */
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import classNames from 'classnames';
import ScanStatistic from 'components/widgets/Scans/ScanStatistic';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import modalActions from 'redux/modal/actions';
import actions from 'redux/racks/actions';
import { constants } from 'utils/constants';
import labConfig from 'utils/labConfig';
import PoolRackDetail from 'pages/RunTemplate/PoolRackDetail';
import styles from './styles.module.scss';

const RackScan = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { Item } = Form;

  const rackId = history.location.pathname.split('/')[2];

  const rack = useSelector((state) => state.racks?.singleRack);

  const { orientation_sign_off, scan_name } = rack;

  useEffect(() => {
    form.setFieldsValue({
      orientation_sign_off,
      scan_name,
    });
  }, [orientation_sign_off, form, scan_name]);

  const onDataChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      dispatch({
        type: actions.RACK_DATA_CHANGE,
        payload: {
          name,
          value,
        },
      });
    },
    [dispatch],
  );

  const saveRack = useCallback(() => {
    dispatch({
      type: actions.UPDATE_RACK_REQUEST,
      payload: {
        id: rackId,
        callback: () => history.push('/rack-scans'),
      },
    });
  }, [dispatch, rackId, history]);

  const onSaveScanModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Save pool rack',
        onOk: saveRack,
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Save',
        message: () => <span>Are you sure to save pool rack?</span>,
      },
    });
  }, [dispatch, saveRack]);

  const handleDelete = useCallback(() => {
    dispatch({
      type: actions.DELETE_RACK_BY_ID_REQUEST,
      payload: { id: rackId },
    });
    history.push('/rack-scans');
  }, [dispatch, history, rackId]);

  const rackMenu = (
    <Menu>
      <Menu.Item key="1" icon={<CloseOutlined />}>
        <Popconfirm
          title="Are you sure to delete Rack?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleDelete}
        >
          Delete rack
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Form form={form} onFinish={onSaveScanModalToggle}>
        <div className={classNames('air__utils__heading', styles.page__header)}>
          <Typography.Title level={4} className="font-weight-normal">
            {rack?.scan_timestamp
              ? `Scan on ${moment(rack?.scan_timestamp)?.format(
                  constants.dateTimeFormat,
                ) ?? ''}`
              : ''}
          </Typography.Title>
          <Dropdown overlay={rackMenu} overlayClassName={styles.actionsOverlay}>
            <Button type="primary">
              Rack Actions
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <Row justify="start" align="middle" gutter={[48, 24]}>
          <Col span={8}>
            <Typography.Text>
              {`${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} name`}
            </Typography.Text>
            <Item name="scan_name" className={styles.formItem}>
              <Input
                onChange={onDataChange}
                name="scan_name"
                placeholder={`${
                  labConfig[process.env.REACT_APP_LAB_ID].naming.rack
                } name`}
              />
            </Item>
          </Col>
          <Col span={8}>
            <Typography.Text>Orientation sign off</Typography.Text>
            <Item
              name="orientation_sign_off"
              className={styles.formItem}
              rules={[
                {
                  max: 4,
                  message: 'This field has a maximum length of 4 characters.',
                },
              ]}
            >
              <Input
                name="orientation_sign_off"
                onChange={onDataChange}
                placeholder="Orientation sign off"
              />
            </Item>
          </Col>
          <Col span={4} offset={4} align="end">
            <Button
              type="primary"
              htmlType="submit"
              disabled={rack?.isLoading}
              loading={rack?.isLoading}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <div className="mb-4">
          <PoolRackDetail id={rackId} edit={true} />
          <ScanStatistic isRack scan={rack} />
        </div>
      </Form>
    </>
  );
};

export default RackScan;
