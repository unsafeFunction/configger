import React, { useEffect, useCallback, useReducer } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  DatePicker,
  InputNumber,
  Select,
} from 'antd';
import moment from 'moment';
import { QrCode, Logo } from 'assets';
import actions from 'redux/intake/actions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case 'setValue':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      throw Error();
  }
}

const Intake = ({ company = {} }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.profile?.companies?.length === 1) {
      componentDispatch({
        type: 'setValue',
        payload: {
          name: 'companyName',
          value: Object.keys(user?.profile?.companies?.[0])?.[0],
        },
      });
      componentDispatch({
        type: 'setValue',
        payload: {
          name: 'companyId',
          value: Object.values(user?.profile?.companies?.[0])?.[0],
        },
      });
      form.setFieldsValue({
        company_name: Object.keys(user?.profile?.companies?.[0])?.[0],
        company_id: Object.values(user?.profile?.companies?.[0])?.[0],
      });
    }
  }, [user]);

  const [state, componentDispatch] = useReducer(reducer, initialState);

  const handleSubmit = useCallback(() => {
    dispatch({
      type: actions.CREATE_PACKING_REQUEST,
      payload: {
        ...state,
      },
    });
  }, [dispatch, state]);

  const handleCompanyNameChange = useCallback((_, objectValue) => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'companyName',
        value: objectValue.label,
      },
    });
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'companyId',
        value: objectValue.value,
      },
    });

    form.setFieldsValue({
      company_id: objectValue.value,
    });
  }, []);

  const handleShippingServiceChange = useCallback((_, objectValue) => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name: 'shippingBy',
        value: objectValue.label,
      },
    });

    form.setFieldsValue({
      shipping_by: objectValue.value,
    });
  }, []);

  const handleInputChange = useCallback((name, value) => {
    componentDispatch({
      type: 'setValue',
      payload: {
        name,
        value,
      },
    });
  }, []);

  return (
    <Row gutter={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 48, xxl: 56 }}>
      <Col sm={16} md={14} lg={12} xl={10} className="mb-5">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Company name"
            name="company_name"
            rules={[
              {
                required: true,
                message: 'Please input company name!',
              },
            ]}
          >
            {user?.profile?.companies?.length > 1 ? (
              <Select
                placeholder="Company name"
                size="middle"
                options={user?.profile?.companies?.map(item => {
                  return {
                    label: Object.keys(item)[0],
                    value: Object.values(item)[0],
                  };
                })}
                showArrow
                showSearch
                optionFilterProp="label"
                dropdownMatchSelectWidth={false}
                onChange={handleCompanyNameChange}
              />
            ) : (
              <Input disabled size="medium" placeholder="Company Name" />
            )}
          </Form.Item>
          <Form.Item label="Company ID" name="company_id">
            <Input disabled size="medium" placeholder="Company ID" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={12}>
              <Form.Item
                type="number"
                label="Samples"
                name="sample_number"
                rules={[
                  {
                    required: true,
                    message: 'Please input samples!',
                  },
                ]}
              >
                <InputNumber
                  className={styles.numericInput}
                  min="0"
                  size="large"
                  placeholder="Samples"
                  onChange={value => handleInputChange('sampleCount', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                label="Pools"
                name="pool_number"
                rules={[
                  {
                    required: true,
                    message: 'Please input pool number!',
                  },
                ]}
              >
                <InputNumber
                  className={styles.numericInput}
                  min="0"
                  size="large"
                  placeholder="Pools"
                  onChange={value => handleInputChange('poolCount', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please select ship date!',
                  },
                ]}
                label="Ship Date"
                name="date"
              >
                <DatePicker
                  onChange={value =>
                    handleInputChange(
                      'shipDate',
                      moment(value).format('YYYY/MM/DD'),
                    )
                  }
                  size="large"
                  className="w-100"
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please select shipping service!',
                  },
                ]}
                label="Ship By"
                name="shipping_by"
              >
                <Select
                  placeholder="Ship By"
                  size="large"
                  showArrow
                  showSearch
                  optionFilterProp="label"
                  dropdownMatchSelectWidth={false}
                  onChange={handleShippingServiceChange}
                  options={[
                    {
                      label: 'FedEx',
                      value: 'fedex',
                    },
                    {
                      label: 'Courier',
                      value: 'courier',
                    },
                    {
                      label: 'Other',
                      value: 'other',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            className={styles.downloadButton}
            size="large"
            type="primary"
            htmlType="submit"
          >
            Save and Download
          </Button>
        </Form>
      </Col>
      <Col lg={12} xl={10} className="mb-5">
        <div className={styles.email}>
          <h2>Hello</h2>
          <span className={styles.titleDescription}>
            These are samples from
          </span>
          <ul className="mb-5">
            <li>
              <span>Company:</span>
              <span>{state.companyName || '-'}</span>
            </li>
            <li>
              <span>ID:</span>
              <span>{state.companyId || '-'}</span>
            </li>
            <li>
              <span>Samples:</span>
              <span>{state.sampleCount || '-'}</span>
            </li>
            <li>
              <span>Pools:</span>
              <span>{state.poolCount || '-'}</span>
            </li>
            <li>
              <span>Date:</span>
              <span>{state.shipDate || '-'}</span>
            </li>
            <li>
              <span>Shipping by:</span>
              <span>{state.shippingBy || '-'}</span>
            </li>
          </ul>
          <QrCode className={styles.qrIcon} />
          <div className={styles.shipmentInfo}>
            <div className={styles.labDetails}>
              <Logo />
              <div className={styles.labAddresses}>
                <span>Ship samples to:</span>
                <span>Mirimus Clinical Labs</span>
                <span>Sample Packing Slip</span>
                <span>710 Parkside Avenue</span>
                <span>Brooklyn, NY 11226</span>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Intake;
