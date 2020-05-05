/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Row, Col, Select, Typography, Switch } from 'antd';

import styles from './styles.module.scss';

const { TextArea } = Input;

const RecipientModal = ({ onChange, onSelectChange, onSwitchChange }) => {
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);

  return (
    <>
      <Row>
        <Col className={styles.campaignInputs} span={18}>
          <Col className={styles.input_wrap} span={24}>
            <span>Username</span>
            <Input
              placeholder="Username"
              required
              name="title"
              onChange={onChange}
            />
          </Col>
          <Row gutter={16}>
            <Col
              className={classNames(styles.input_wrap, styles.input__deeplink)}
              span={10}
            >
              <span>From number</span>
              <Select
                onChange={value =>
                  onSelectChange(value, { name: 'fromNumber' })
                }
                name="fromNumber"
                placeholder="e.g 1 415 993 8030"
              >
                <Select.Option value="+17739662558">+17739662558</Select.Option>
              </Select>
            </Col>
            <Col className={styles.domainEnable} span={7}>
              <Switch name="conversationEnabled" onChange={onSwitchChange} />
              <Typography.Text>Conversations</Typography.Text>
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles.input_wrap}>
              <span>{`SMS default body | Variables #{username} #{link}`}</span>
              <TextArea
                placeholder="e.g. Hi #{username}. Get 20% off on next reading #{link}"
                rows={5}
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
  onSwitchChange: PropTypes.func.isRequired,
};

export default RecipientModal;
