import React from 'react';
import { Input, Row, Col, Typography} from 'antd';

import styles from './styles.module.scss';

const SettingsInputs = () => {
    return (
      <Row>
        <Col className={styles.settingsField} span={24}>
          <Typography.Paragraph className={styles.settings__title}>Account SID</Typography.Paragraph>
          <Input placeholder="Account SID" />
        </Col>
        <Col className={styles.settingsField} span={24}>
          <Typography.Paragraph className={styles.settings__title}>Auth Token</Typography.Paragraph>
          <Input placeholder="Auth Token" />
        </Col>
        <Col className={styles.settingsField} span={24}>
          <Typography.Paragraph className={styles.settings__title}>Notify Service SID</Typography.Paragraph>
          <Input placeholder="Notify Service SID" />
        </Col>
      </Row>
    )
}

export default SettingsInputs;