/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'emoji-mart/css/emoji-mart.css';
import { Input, Row, Col, Select, Typography, Switch, Form } from 'antd';
import styles from './styles.module.scss';
import style from '../../Customer/CustomerModal/style.module.scss';
import { constants } from '../../../../utils/constants';

const { TextArea } = Input;
const { Option } = Select;

const CompanyModal = ({}) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const { Item } = Form;

  const dispatch = useDispatch();

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
        <Item
          label="Title"
          name="title"
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
          label="Street address"
          name="street_address"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Short name" className={style.formItem} />
        </Item>
        <Item label="Street address 2" name="street_address2">
          <Input placeholder="Street address 2" className={style.formItem} />
        </Item>
        <Item
          label="City"
          name="city"
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
          label="State"
          name="state"
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
            // loading={areCompaniesLoading}
            showArrow
            showSearch
            optionFilterProp="label"
            dropdownMatchSelectWidth={false}
          />
        </Item>
        <Item
          label="Zipcode"
          name="zipcode"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Zipcode" className={style.formItem} />
        </Item>
      </div>
    </Form>
  );
};

export default CompanyModal;
