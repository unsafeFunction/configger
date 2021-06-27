/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Input, Select, Form } from 'antd';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const ControlTubeModal = ({ form }) => {
  const { Item } = Form;
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
