/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tabs, Input, Row, Col } from 'antd';

import styles from './styles.module.scss';

const { TabPane } = Tabs;
const { TextArea } = Input;

const CampaignModal = React.memo(({onChange}) => {
    return (
      <Tabs defaultActiveKey={1}>
        <TabPane tab="Tab Name1" key={1}>
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
                placeholder="Key"
                required
                name="key"
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row className={styles.link_wrap}>
            <Col className={classNames(styles.input_wrap, styles.input__deeplink)} span={11}>
              <span>Deeplink custom domain</span>
              <Input
                type="select"
                name="deeplink"
                onChange={onChange}
              />
            </Col>
            <Col className={styles.input_wrap} span={11}>
              <span>Destination URL</span>
              <Input
                name="destination"
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles.input_wrap}>
              <span>SMS body</span>
              <TextArea
                placeholder="Sms Body"
                rows={5}
                name="body"
                onChange={onChange}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Tab Name1" key={2}>
                Content 1
        </TabPane>
      </Tabs>
    )
})

CampaignModal.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default CampaignModal;