/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Input, Row, Col, Select, Typography, DatePicker } from 'antd';

import styles from './styles.module.scss';

const { TextArea } = Input;

const RecipientModal = ({ onChange, onSelectChange, onPickerChange }) => {
  const recipient = useSelector(state => state.recipients.singleRecipient);

  return (
    <>
      <Row>
        <Col className={styles.tabDescription} span={6}>
          <Typography.Text>Recipient</Typography.Text>
          <p>
            Add recipient’s phone number and define custom SMS text and delivery
            time if needed
          </p>
        </Col>
        <Col className={styles.campaignInputs} span={18}>
          <Row>
            <Col className={styles.input_wrap} span={24}>
              <span>Recipient name(optional)</span>
              <Input
                placeholder="Recipient name"
                required
                name="username"
                value={recipient.username}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col
              className={classNames(styles.input_wrap, styles.input__deeplink)}
              span={10}
            >
              <span>To number</span>
              <Input
                onChange={onChange}
                name="toNumber"
                placeholder="e.g 1 415 993 8030"
                value={recipient.toNumber}
              />
            </Col>
            <Col
              className={classNames(styles.input_wrap, styles.input__deeplink)}
              span={14}
            >
              <span>Delivery time(optional)</span>
              <DatePicker
                name="deliveryTime"
                format="YYYY-MM-DD HH:mm:ss"
                onChange={onPickerChange}
                value={recipient.deliveryTime && moment(recipient.deliveryTime)}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            </Col>
          </Row>
          <Row />
          <Row>
            <Col span={24} className={styles.input_wrap}>
              <span>{`SMS custom body | Variables #{username} #{link} (optional)`}</span>
              <TextArea
                placeholder="e.g. Hi #{username}. Get 20% off on next reading #{link}"
                rows={5}
                value={recipient.smsBody}
                name="smsBody"
                onChange={onChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

RecipientModal.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onPickerChange: PropTypes.func.isRequired,
};

export default RecipientModal;
