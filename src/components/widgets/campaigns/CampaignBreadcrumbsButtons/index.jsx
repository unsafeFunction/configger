import React, { useCallback, useState } from 'react'
import { Row, Col, Button, Space, Progress, DatePicker } from 'antd'
import styles from './styles.module.scss'

const CampaignBreadcrumbsButtons = () => {
  const [selectedDate, setDate] = useState(null)

  const onDateChange = useCallback(date => {
    setDate(date)
  }, [])
  return (
    <Row className={styles.campaign_buttons}>
      <div className={styles.buttons__progress}>
        <Progress percent={30} size="small" />
      </div>
      <Space>
        <Col>
          {/* <Button
              className={styles.buttons__schedule}
              icon={
                // <div>
                // at 12:00 AM
                // </div>}
                <DatePicker />
              }
            >
              Scheduled
            </Button> */}
          {selectedDate && <span className={styles.scheduledText}>Schedule at</span>}
          <DatePicker placeholder="Scheduled at" showTime onChange={onDateChange} />
        </Col>
        <Col>
          <Button type="primary">Send</Button>
        </Col>
      </Space>
    </Row>
  )
}

export default CampaignBreadcrumbsButtons
