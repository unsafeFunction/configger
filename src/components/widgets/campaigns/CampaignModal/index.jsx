/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Row, Col, Select, Typography, Switch } from 'antd';

import styles from './styles.module.scss';

const { TextArea } = Input;

const CampaignModal = ({ onChange, onSelectChange, onSwitchChange }) => {
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);

  return (
    <>
      <Row>
        <Col className={styles.tabDescription} span={6}>
          <Typography.Text>SMS Campaign</Typography.Text>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            non elit et magna laoreet lacinia. Praesent aliquet quis ante quis
            venenatis. Nunc eros mi, sollicitudin tristique nulla ut, malesuada
            pharetra leo. in faucibus quam urna eget mi. Morbi et aliquam
            mauris, nec lacinia turpis.
          </p>
        </Col>
        <Col className={styles.campaignInputs} span={18}>
          <Row>
            <Col className={styles.input_wrap} span={24}>
              <span>Title</span>
              <Input
                placeholder="Campaign Name"
                required
                name="title"
                onChange={onChange}
              />
            </Col>
            <Col className={styles.input_wrap} span={24}>
              <span>Key</span>
              <Input
                placeholder="e.g SMS 20SF | FEMALE | 35-40 "
                required
                name="key"
                onChange={onChange}
              />
            </Col>
          </Row>
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
            <Col className={styles.domainEnable} span={7}>
              <Switch name="trackingEnabled" onChange={onSwitchChange} />
              <Typography.Text>Tracking</Typography.Text>
            </Col>
          </Row>
          <Row />
          {singleCampaign.trackingEnabled && (
            <Row className={styles.link_wrap}>
              <Col
                className={classNames(
                  styles.input_wrap,
                  styles.input__deeplink,
                )}
                span={11}
              >
                <span>Deeplink custom domain</span>
                <Select
                  name="deepLinkDomain"
                  placeholder="Deeplink domain"
                  style={{ width: '100%' }}
                  onChange={value =>
                    onSelectChange(value, { name: 'deepLinkDomain' })
                  }
                >
                  <Select.Option value="https://oa-sms-offers-dev.herokuapp.com/o">
                    https://oa-sms-offers-dev.herokuapp.com/o
                  </Select.Option>
                </Select>
              </Col>
              <Col className={styles.input_wrap} span={11}>
                <span>Destination URL</span>
                <Input
                  addonBefore="https://"
                  name="originalLink"
                  onChange={onChange}
                />
              </Col>
            </Row>
          )}
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

CampaignModal.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
};

export default CampaignModal;
