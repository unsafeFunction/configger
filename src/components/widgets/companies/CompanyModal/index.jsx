/* eslint-disable import/no-extraneous-dependencies */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import React from 'react';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const CompanyModal = ({ form }) => {
  const { Item, List } = Form;
  return (
    <Form form={form} layout="vertical" className={styles.companyModalWrapper}>
      <div>
        <p>Company details</p>
        <Item
          label="Name"
          name="name"
          className={styles.formItem}
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Company name" />
        </Item>
        <Item label="Short name" className={styles.formItem} name="name_short">
          <Input placeholder="Short name" />
        </Item>
      </div>
      <div>
        <p>Location details</p>
        <List name="company_locations">
          {(fields, { add, remove }, {}) => {
            return (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    direction="vertical"
                  >
                    <Item
                      {...field}
                      className={styles.formItem}
                      name={[field.name, 'title']}
                      fieldKey={[field.fieldKey, 'title']}
                      label="Title"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Input placeholder="Title" />
                    </Item>
                    <Item
                      {...field}
                      className={styles.formItem}
                      name={[field.name, 'street_address']}
                      fieldKey={[field.fieldKey, 'street_address']}
                      label="Street address"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Input placeholder="Street address" />
                    </Item>
                    <Item
                      {...field}
                      className={styles.formItem}
                      name={[field.name, 'street_address2']}
                      fieldKey={[field.fieldKey, 'street_address2']}
                      label="Street address 2"
                    >
                      <Input placeholder="Street address 2" />
                    </Item>
                    <Item
                      {...field}
                      className={styles.formItem}
                      name={[field.name, 'city']}
                      fieldKey={[field.fieldKey, 'city']}
                      label="City"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Input placeholder="City" />
                    </Item>
                    <Item
                      {...field}
                      name={[field.name, 'state']}
                      className={styles.formItem}
                      fieldKey={[field.fieldKey, 'state']}
                      label="State"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Select
                        placeholder="State"
                        size="middle"
                        options={constants.USstates}
                        showArrow
                        showSearch
                        optionFilterProp="label"
                        dropdownMatchSelectWidth={false}
                      />
                    </Item>
                    <Item
                      {...field}
                      name={[field.name, 'zipcode']}
                      className={styles.formItem}
                      fieldKey={[field.fieldKey, 'zipcode']}
                      label="Zipcode"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Input placeholder="Zipcode" />
                    </Item>
                    <Item className={styles.formItem}>
                      <Button
                        type="dashed"
                        className={styles.addCompanyLocationBtn}
                        onClick={() => remove(field.name)}
                        block
                        icon={<MinusCircleOutlined />}
                      >
                        Delete
                      </Button>
                    </Item>
                  </Space>
                ))}
                <Item>
                  <Button
                    type="dashed"
                    className={styles.addCompanyLocationBtn}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Company Location
                  </Button>
                </Item>
              </>
            );
          }}
        </List>
      </div>
    </Form>
  );
};

export default CompanyModal;
