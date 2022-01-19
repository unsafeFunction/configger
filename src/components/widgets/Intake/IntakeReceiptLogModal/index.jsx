import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/companies/actions';
import { constants } from 'utils/constants';
import rules from 'utils/formRules';
import styles from './styles.module.scss';

const IntakeReceiptLogModal = ({ form, edit }) => {
  const { Item } = Form;
  const { TextArea } = Input;
  const dispatch = useDispatch();

  const [isCommentsSelected, setCommentsSelected] = useState(false);
  const [searchName, setSearchName] = useState(undefined);

  const isSampleConditionValueOther =
    form.getFieldValue('sample_condition') === 'Other';

  const handleChangeCommentsVisibility = useCallback(
    (e) => {
      const { value } = e.target;
      return setCommentsSelected(value === 'Other');
    },
    [setCommentsSelected],
  );

  const companies = useSelector((state) => state.companies.all);

  useEffect(() => {
    if (!edit) {
      dispatch({
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
        },
      });
    }
  }, [dispatch, edit]);

  useEffect(() => {
    setCommentsSelected(isSampleConditionValueOther);
  }, [setCommentsSelected, isSampleConditionValueOther]);

  const loadMore = () => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants?.companies?.itemsLoadingCount,
        offset: companies.offset,
        search: searchName,
      },
    });
  };

  const sendQuery = (query) => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        search: query,
      },
    });
  };

  const delayedQuery = debounce((q) => sendQuery(q), 500);

  const handleSearch = (value) => {
    setSearchName(value);
    delayedQuery(value);
  };

  const handleCompanyNameChange = (_, objectValue) => {
    form.setFieldsValue({
      company_short: objectValue.company.name_short,
      company_id: objectValue.company.company_id,
    });
  };

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
        company_id: '',
      }}
      scrollToFirstError
    >
      <Row gutter={{ md: 32, lg: 48 }}>
        <Col xs={24} md={12}>
          <Item
            label="Company name"
            name="company_name"
            rules={[rules.required]}
          >
            <Select
              disabled={edit}
              placeholder="Company name"
              options={companies.items.map((item) => {
                return {
                  label: item.name,
                  value: item.name,
                  company: item,
                };
              })}
              loading={!companies.isLoading}
              dropdownStyle={{
                maxHeight: 300,
                overflowY: 'hidden',
                overflowX: 'scroll',
              }}
              showSearch
              listHeight={0}
              dropdownMatchSelectWidth={false}
              dropdownRender={(menu) => (
                <InfiniteScroll
                  next={loadMore}
                  hasMore={companies.items.length < companies.total}
                  dataLength={companies.items.length}
                  height={300}
                >
                  {menu}
                </InfiniteScroll>
              )}
              optionFilterProp="label"
              size="large"
              onSearch={handleSearch}
              searchValue={searchName}
              onChange={handleCompanyNameChange}
            />
          </Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Item label="Company short" name="company_short">
                <Input disabled placeholder="Company short" />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item
                label="Company ID"
                name="company_id"
                rules={[rules.required]}
              >
                <Input disabled placeholder="Company ID" />
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
                      // eslint-disable-next-line prefer-promise-reject-errors
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

IntakeReceiptLogModal.propTypes = {
  form: PropTypes.shape({}).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default IntakeReceiptLogModal;
