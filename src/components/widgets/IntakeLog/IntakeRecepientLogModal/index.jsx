import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'redux/companies/actions';
import { Form, Input, Select, InputNumber, Button } from 'antd';
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styles from './styles.module.scss';

const IntakeRecepientLogModal = ({ form, edit }) => {
  const [isCommentsSelected, setCommentsSelected] = useState(false);
  const dispatch = useDispatch();
  const { Item } = Form;
  const { TextArea } = Input;

  const isSampleConditionValueOther =
    form.getFieldValue('sample_condition') === 'Other';

  const handleChangeCommentsVisibility = useCallback(
    (value) => {
      return setCommentsSelected(value === 'Other');
    },
    [setCommentsSelected],
  );
  const company = useSelector((state) => state.companies.singleCompany);

  useEffect(() => {
    if (!edit) {
      form.setFieldsValue({
        company_name: company.name,
        company_short: company.name_short,
      });
    }
  }, [company]);

  useEffect(() => {
    setCommentsSelected(isSampleConditionValueOther);
  }, [setCommentsSelected, isSampleConditionValueOther]);

  const handleBlurCompany = useCallback((e) => {
    const { target } = e;

    target.value &&
      dispatch({
        type: actions.FETCH_COMPANY_SHORT_REQUEST,
        payload: {
          id: target.value,
        },
      });
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ tracking_numbers: [''] }}
    >
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
        <Input
          disabled={edit}
          placeholder="Company ID"
          onBlur={handleBlurCompany}
        />
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
        className={styles.formItem}
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
          ]}
        />
      </Item>

      <Item
        label="Sample condition"
        name="sample_condition"
        className={styles.formItem}
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
        ]}
      >
        <Select
          placeholder="Sample condition"
          showArrow
          onChange={handleChangeCommentsVisibility}
          showSearch
          optionFilterProp="label"
          options={[
            {
              label: 'Acceptable',
              value: 'Acceptable',
            },
            {
              label: 'Unacceptable',
              value: 'Unacceptable',
            },
            {
              label: 'Other (see Comments)',
              value: 'Other',
            },
          ]}
        />
      </Item>
      {isCommentsSelected && (
        <Item label="Comments" name="comments" className={styles.formItem}>
          <TextArea placeholder="Comments" />
        </Item>
      )}

      <Form.List name="tracking_numbers" className={styles.formItem}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Item
                label={index === 0 ? 'Tracking Numbers' : ''}
                required={false}
                key={field.key}
                className={styles.trackingWrapper}
              >
                <Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: fields.length > 1,
                      whitespace: true,
                      message:
                        'Please input tracking number or delete this field.',
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="Tracking Number"
                    style={{ width: fields.length > 1 ? '91%' : '100%' }}
                  />
                </Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className={styles.dynamicDeleteButton}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Item>
            ))}
            <Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                Add tracking number
              </Button>
              <Form.ErrorList errors={errors} />
            </Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default IntakeRecepientLogModal;
