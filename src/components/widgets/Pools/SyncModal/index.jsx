import { Checkbox, Form } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.module.scss';

const SyncModal = ({ form }) => {
  const options = [
    { label: 'Results contacts', value: 'results_contacts' },
    { label: 'Testing contacts', value: 'testing_contacts' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        notify: ['results_contacts', 'testing_contacts'],
      }}
    >
      <Form.Item name="notify" label="Notifications will be sent to">
        <Checkbox.Group options={options} className={styles.notifications} />
      </Form.Item>
    </Form>
  );
};

SyncModal.propTypes = {
  form: PropTypes.shape({}).isRequired,
};

export default SyncModal;
