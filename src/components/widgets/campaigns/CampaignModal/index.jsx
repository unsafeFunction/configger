/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { SMSCalculator } from '@fasttrack-solutions/sms-calculator';
import { SmileOutlined } from '@ant-design/icons';
import { Input, Row, Col, Select, Typography, Switch } from 'antd';
import actions from 'redux/campaigns/actions';
import useOnClickOutside from 'hooks/useClickOutside';
import styles from './styles.module.scss';

const { TextArea } = Input;

const CampaignModal = ({ onChange, onSelectChange, onSwitchChange }) => {
  const singleCampaign = useSelector(state => state.campaigns.singleCampaign);
  const [smsDescription, setSmsDescription] = useState({});
  const [isEmojiOpen, openEmojiPicker] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => openEmojiPicker());

  const dispatch = useDispatch();

  useEffect(() => {
    setSmsDescription(state => ({
      ...state,
      ...SMSCalculator.getCount(singleCampaign.smsBody || ''),
    }));
  }, [singleCampaign.smsBody]);

  const onOpenEmojiPicker = useCallback(() => {
    openEmojiPicker(!isEmojiOpen);
  }, [isEmojiOpen]);

  const onSmileSelect = useCallback(
    emoji => {
      dispatch({
        type: actions.ADD_SMILE_TO_SMS_BODY,
        payload: emoji.native,
      });
    },
    [dispatch],
  );

  return (
    <>
      <Row>
        <Col className={styles.tabDescription} span={6}>
          <Typography.Text>SMS Campaign</Typography.Text>
          <p>
            Send bulk messages to your contacts. You can include custom
            (branded) tracking URL to your webpage and receive customer’s
            replies if needed.
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
                <span>Tracking domain</span>
                <Select
                  name="deepLinkDomain"
                  placeholder="Tracking domain"
                  style={{ width: '100%' }}
                  onChange={value =>
                    onSelectChange(value, { name: 'deepLinkDomain' })
                  }
                >
                  <Select.Option value="https://sms-offer.com/s">
                    https://sms-offer.com/s
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
                value={singleCampaign.smsBody}
              />
              <div className={styles.campaignDescription}>
                <SmileOutlined size={16} onClick={onOpenEmojiPicker} />
                {isEmojiOpen && (
                  <div ref={ref} className={styles.pickerWrap}>
                    <Picker onSelect={onSmileSelect} title="Select emoji" />
                  </div>
                )}
                {smsDescription &&
                  `${smsDescription.numberOfSMS}/${smsDescription.remaining} remaining`}
              </div>
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
