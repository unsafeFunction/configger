/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'emoji-mart/css/emoji-mart.css';
import { Input, Row, Col, Select, Typography, Switch, Form } from 'antd';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const ControlTubeModal = ({ form }) => {
  const { Item, List } = Form;
  return (
    <Form form={form} layout="vertical" className={styles.companyModalWrapper}>
      <div>
        <Item
          label="Name"
          name="tube_id"
          className={styles.formItem}
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Input placeholder="Tube ID" />
        </Item>
        <Item
          name="control"
          className={styles.formItem}
          label="Control"
          rules={[
            {
              required: true,
              message: 'This field is required.',
            },
          ]}
        >
          <Select
            placeholder="Control"
            size="middle"
            options={constants.controlTypes}
            showArrow
            showSearch
            optionFilterProp="label"
            dropdownMatchSelectWidth={false}
          />
        </Item>
      </div>
    </Form>
  );
};

export default ControlTubeModal;
