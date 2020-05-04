import React, { useState, useCallback } from 'react'
import { Button, Row, Col, Typography } from 'antd'
import SettingsInputs from './SettingsInputs'
import styles from './styles.module.scss'

const AccountSettings = () => {
  const [isAccountDetailsReveal, onReveal] = useState(false)

  const onClick = useCallback(() => {
    onReveal(!isAccountDetailsReveal)
  }, [isAccountDetailsReveal])

  return (
    <>
      <Row>
        <Col span={10}>
          <Typography.Title level={4}>Twilio account</Typography.Title>
          <Typography.Paragraph>
            Get your Account Sid and Auth Token from:
            <Typography.Paragraph type="secondary" underline>
              <a href=" https://www.twilio.com/console." linkTarget="__blank">
                Twilio console.
              </a>
            </Typography.Paragraph>
          </Typography.Paragraph>
          <Typography.Paragraph>
            Then set up Notify Service Instance:
            <Typography.Paragraph type="secondary" underline>
              <a href="https://www.twilio.com/console/notify/services" linkTarget="__blank">
                Notify Service Instance.
              </a>
            </Typography.Paragraph>
          </Typography.Paragraph>
        </Col>
        <Col span={14}>
          <div className={styles.accountSettingsHeader}>
            {isAccountDetailsReveal && <Typography.Paragraph>Title</Typography.Paragraph>}
            <Button onClick={onClick} type="primary" ghost>
              {isAccountDetailsReveal ? 'Hide Account Details' : 'Reveal Account Details'}
            </Button>
          </div>
          {isAccountDetailsReveal && <SettingsInputs />}
        </Col>
      </Row>
    </>
  )
}

export default AccountSettings
