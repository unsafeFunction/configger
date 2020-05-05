import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Space, Progress, DatePicker } from 'antd';
import actions from 'redux/campaigns/actions';
import styles from './styles.module.scss';

const CampaignBreadcrumbsButtons = () => {
  const [selectedDate, setDate] = useState(null);
  const dispatch = useDispatch();

  const onDateChange = useCallback(
    date => {
      dispatch({
        type: actions.ON_CAMPAIGN_DATA_CHANGE,
        payload: {
          value: date,
          name: 'startDateTime',
        },
      });
    },
    [dispatch],
  );

  const startCampaign = useCallback(() => {
    dispatch({
      type: actions.START_CAMPAIGN_REQUEST,
      payload: {},
    });
  }, [dispatch]);

  return (
    <Row className={styles.campaign_buttons}>
      <div className={styles.buttons__progress}>
        <Progress percent={30} size="small" />
      </div>
      <Space>
        <Col>
          {selectedDate && (
            <span className={styles.scheduledText}>Schedule at</span>
          )}
          <DatePicker
            placeholder="Scheduled at"
            showTime
            onChange={onDateChange}
          />
        </Col>
        <Col>
          <Button onClick={startCampaign} type="primary">
            Send
          </Button>
        </Col>
      </Space>
    </Row>
  );
};

export default CampaignBreadcrumbsButtons;
