import { Form, Radio, Space } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import rules from 'utils/formRules';

const SyncModal = ({ form }) => {
  const { Item } = Form;

  const notificationOptions = [
    { label: 'do not notify', value: 'do_not_notify' },
    { label: 'notify everyone', value: 'notify_everyone' },
    {
      label: 'notify result contacts (admins)',
      value: 'notify_result_contacts',
    },
    { label: 'notify testing contacts', value: 'notify_testing_contacts' },
    { label: 'notify with detected result', value: 'notify_detected' },
    { label: 'notify these barcodes only', value: 'notify_barcodes' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        notification_option: 'notify_everyone',
      }}
    >
      <Item name="notification_option" rules={[rules.required]}>
        <Radio.Group>
          <Space direction="vertical">
            {notificationOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Item>
    </Form>
  );
};

SyncModal.propTypes = {
  form: PropTypes.shape({}).isRequired,
};

export default SyncModal;
