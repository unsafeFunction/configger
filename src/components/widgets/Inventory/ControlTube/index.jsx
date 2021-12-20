import { Form, Input, Select } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { constants } from 'utils/constants';
import rules from 'utils/formRules';
import styles from './styles.module.scss';

const ControlTubeModal = ({ form }) => {
  const { Item } = Form;
  return (
    <Form form={form} layout="vertical" className={styles.companyModalWrapper}>
      <div>
        <Item
          label="Tube ID"
          name="tube_id"
          className={styles.formItem}
          rules={[rules.required]}
        >
          <Input placeholder="Tube ID" />
        </Item>
        <Item
          name="control"
          className={styles.formItem}
          label="Control Type"
          rules={[rules.required]}
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

ControlTubeModal.propTypes = {
  form: PropTypes.shape({}).isRequired,
};

export default ControlTubeModal;
