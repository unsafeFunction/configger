import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'redux/companies/actions';
import debounce from 'lodash.debounce';
import { Form, Input, Select, InputNumber } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

const IntakeRecepientLogModal = ({ form }) => {
  const dispatch = useDispatch();
  const { Item } = Form;

  const company = useSelector(state => state.companies.singleCompany);

  useEffect(() => {
    form.setFieldsValue({
      company_name: company.name,
      company_short: company.name_short,
    });
  }, [company]);

  const sendQuery = useCallback(query => {
    dispatch({
      type: actions.FETCH_COMPANY_SHORT_REQUEST,
      payload: {
        id: query,
      },
    });
  }, []);

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const handleChangeCompany = useCallback(e => {
    const { target } = e;

    if (target.value) {
      delayedQuery(target.value);
    } else {
      form.setFieldsValue({
        company_name: '',
        company_short: '',
      });
    }
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Item
        label="Company ID"
        name="company_id"
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <Input placeholder="Company ID" onChange={handleChangeCompany} />
      </Item>

      <Item
        label="Company name"
        name="company_name"
        rules={[
          {
            required: true,
            message: `The company with this ID wasn't found`,
          },
        ]}
      >
        <Input
          disabled
          placeholder="Company name"
          suffix={company.isLoadingCompany && <LoadingOutlined />}
        />
      </Item>

      <Item label="Company short" name="company_short">
        <Input
          disabled
          placeholder="Company short"
          suffix={company.isLoadingCompany && <LoadingOutlined />}
        />
      </Item>

      <Item
        label="Reference pools count"
        name="reference_pools_count"
        className={styles.formItem}
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <InputNumber
          placeholder="Reference pools count"
          className="w-100"
          min={1}
        />
      </Item>

      <Item
        label="Reference samples count"
        name="reference_samples_count"
        className={styles.formItem}
        dependencies={['reference_pools_count']}
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (getFieldValue('reference_pools_count') <= value) {
                return Promise.resolve();
              }

              return Promise.reject(
                'The number of pools must be less than or equal to the number of samples',
              );
            },
          }),
        ]}
      >
        <InputNumber
          placeholder="Reference samples count"
          className="w-100"
          min={1}
        />
      </Item>

      <Item
        label="Shipping by"
        name="shipment"
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <Select
          placeholder="Shipping by"
          showArrow
          showSearch
          optionFilterProp="label"
          options={[
            {
              label: 'FedEx',
              value: 'FedEx',
            },
            {
              label: 'UPS',
              value: 'UPS',
            },
            {
              label: 'Dropoff',
              value: 'Dropoff',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ]}
        />
      </Item>

      <Item label="Tracking number" name="tracking_number">
        <Input placeholder="Tracking Number" />
      </Item>
    </Form>
  );
};

export default IntakeRecepientLogModal;
