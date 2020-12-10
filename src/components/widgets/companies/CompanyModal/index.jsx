/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'emoji-mart/css/emoji-mart.css';
import {
  Input,
  Row,
  Col,
  Select,
  Typography,
  Switch,
  Form,
  Space,
  Button,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';
import style from '../../Customer/CustomerModal/style.module.scss';
import { constants } from '../../../../utils/constants';

const CompanyModal = ({ form }) => {
  const { Item, List } = Form;
  return (
    <Form form={form} layout="vertical">
      <div>
        <p>Company details</p>
        <Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Company name" className={style.formItem} />
        </Item>
        <Item
          label="Short name"
          name="name_short"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Short name" className={style.formItem} />
        </Item>
        <Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Code" className={style.formItem} />
        </Item>
        <Item
          label="Company Id"
          name="company_id"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Company Id" className={style.formItem} />
        </Item>
      </div>
      <div>
        <p>Location details</p>
        <List name="company_locations">
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map(field => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    direction="vertical"
                  >
                    <Item
                      {...field}
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
                      <Input placeholder="Title" className={style.formItem} />
                    </Item>
                    <Item
                      {...field}
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
                      <Input
                        placeholder="Short name"
                        className={style.formItem}
                      />
                    </Item>
                    <Item
                      {...field}
                      name={[field.name, 'street_address2']}
                      fieldKey={[field.fieldKey, 'street_address2']}
                      label="Street address 2"
                    >
                      <Input
                        placeholder="Street address 2"
                        className={style.formItem}
                      />
                    </Item>
                    <Item
                      {...field}
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
                      <Input placeholder="City" className={style.formItem} />
                    </Item>
                    <Item
                      {...field}
                      name={[field.name, 'state']}
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
                      fieldKey={[field.fieldKey, 'zipcode']}
                      label="Zipcode"
                      rules={[
                        {
                          required: true,
                          message: 'This field is required.',
                        },
                      ]}
                    >
                      <Input placeholder="Zipcode" className={style.formItem} />
                    </Item>
                    <Item>
                      <Button
                        type="dashed"
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
