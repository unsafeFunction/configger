import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'redux/companies/actions';
import debounce from 'lodash.debounce';
import { Form, Input, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

const IntakeRecepientLogModal = ({ form }) => {
  const dispatch = useDispatch();
  const { Item } = Form;

  const company = useSelector(state => state.companies.singleCompany);

  useEffect(() => {
    if (company.name) {
      form.setFieldsValue({
        company_name: company.name,
        company_short: company.name_short,
      });
    }
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
    }

    form.setFieldsValue({
      company_name: '',
      company_short: '',
    });
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Item
        label="Company ID"
        name="company_id"
        className={styles.formItem}
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
        className={styles.formItem}
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

      <Item
        label="Company short"
        name="company_short"
        className={styles.formItem}
      >
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
        <Input type="number" placeholder="Reference pools count" />
      </Item>

      <Item
        label="Reference samples count"
        name="reference_samples_count"
        className={styles.formItem}
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <Input type="number" placeholder="Reference samples count" />
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

      <Item
        label="Tracking number"
        name="tracking_number"
        className={styles.formItem}
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <Input placeholder="Tracking Number" />
      </Item>
    </Form>
  );
};

export default IntakeRecepientLogModal;
