import React from 'react';
import { Row, Col, Button, Space, Progress } from 'antd';
import styles from './styles.module.scss';


const CampaignBreadcrumbsButtons = () => {
    return (
      <Row className={styles.campaign_buttons}>
        <div className={styles.buttons__progress}>
          <Progress percent={30} size="small" />
        </div>
        <Space>
          <Col>
            <Button
              className={styles.buttons__schedule}
              icon={
                <div>
                at 12:00 AM
                </div>}
            >
              Scheduled
            </Button>
          </Col>
          <Col>
            <Button type="primary">Send</Button>
          </Col>
        </Space>
      </Row>
    )
}

export default CampaignBreadcrumbsButtons;