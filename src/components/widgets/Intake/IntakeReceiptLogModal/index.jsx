import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/companies/actions';
import { constants } from 'utils/constants';
import rules from 'utils/formRules';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const IntakeReceiptLogModal = ({ form, edit }) => {
  const [isCommentsSelected, setCommentsSelected] = useState(false);
  const dispatch = useDispatch();
  const { Item } = Form;
  const { TextArea } = Input;

  const isSampleConditionValueOther =
    form.getFieldValue('sample_condition') === 'Other';

  const handleChangeCommentsVisibility = useCallback(
    (e) => {
      const { value } = e.target;
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
  }, [form, company, edit]);

  useEffect(() => {
    setCommentsSelected(isSampleConditionValueOther);
  }, [setCommentsSelected, isSampleConditionValueOther]);

  const handleBlurCompany = useCallback(
    (e) => {
      const { value } = e.target;

      if (value) {
        dispatch({
          type: actions.FETCH_COMPANY_SHORT_REQUEST,
          payload: { id: value },
        });
      }
    },
    [dispatch],
  );

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        tracking_numbers: [''],
        shipped_on: moment(),
        shipping_condition: 'Satisfactory',
        shipping_violations: [],
        packing_slip_condition: 'Satisfactory',
        sample_condition: 'Acceptable',
      }}
      scrollToFirstError
    >
      <Row gutter={{ md: 32, lg: 48 }}>
        <Col xs={24} md={12}>
          <Item label="Company ID" name="company_id" rules={[rules.required]}>
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
          <Row gutter={8}>
            <Col xs={24} sm={12}>
              <Item
                label="Reference pools count"
                name="reference_pools_count"
                rules={[rules.required]}
              >
                <InputNumber
                  type="number"
                  placeholder="Reference pools count"
                  className="w-100"
                  min={1}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item
                label="Reference samples count"
                name="reference_samples_count"
                dependencies={['reference_pools_count']}
                rules={[
                  rules.required,
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const pools = getFieldValue('reference_pools_count');
                      if (value >= pools * 2 && value <= pools * 24) {
                        return Promise.resolve();
                      }
                      return Promise.reject('2 - 24 tubes per rack');
                    },
                  }),
                ]}
                className={styles.refSamples}
              >
                <InputNumber
                  type="number"
                  placeholder="Reference samples count"
                  className="w-100"
                  min={2}
                />
              </Item>
            </Col>
          </Row>
          <Item label="Shipped on" name="shipped_on" rules={[rules.required]}>
            <DatePicker className={styles.datePicker} format="YYYY-MM-DD" />
          </Item>
          <Item label="Shipping by" name="shipment" rules={[rules.required]}>
            <Select
              placeholder="Shipping by"
              showArrow
              showSearch
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              optionFilterProp="label"
              options={constants.shippingBy}
            />
          </Item>
          <Item
            label="Shipping condition"
            name="shipping_condition"
            rules={[rules.required]}
          >
            <Radio.Group className={styles.radioGroup}>
              {constants.shippingConditions.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item label="Shipping violations" name="shipping_violations">
            <Checkbox.Group>
              <Row>
                {constants.shippingViolations.map((item) => (
                  <Col span={12} key={item.value}>
                    <Checkbox value={item.value} className="mb-1">
                      {item.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Item>
          <Item
            label="Packing slip condition"
            name="packing_slip_condition"
            rules={[rules.required]}
          >
            <Radio.Group className={styles.radioGroup}>
              {constants.shippingConditions.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
          <Item
            label="Total number of packing slips submitted"
            name="total_packing_slips"
            rules={[rules.required]}
          >
            <InputNumber
              type="number"
              placeholder="Total number of packing slips submitted"
              className="w-100"
              min={1}
            />
          </Item>
          <Item
            label="Sample condition"
            name="sample_condition"
            rules={[rules.required]}
          >
            <Radio.Group
              className={styles.radioGroup}
              onChange={handleChangeCommentsVisibility}
            >
              {constants.sampleConditions.map((item) => (
                <Radio key={item.value} value={item.value} className="mb-1">
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
          {isCommentsSelected && (
            <Item label="Comments" name="comments">
              <TextArea placeholder="Comments" />
            </Item>
          )}
          <Form.List name="tracking_numbers">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Item
                    label={index === 0 ? 'Tracking numbers' : ''}
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
                        placeholder="Tracking number"
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
        </Col>
      </Row>
    </Form>
  );
};

export default IntakeReceiptLogModal;
