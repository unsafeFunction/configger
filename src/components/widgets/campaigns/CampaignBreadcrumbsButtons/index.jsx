import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Space, Progress, DatePicker, Skeleton } from 'antd';
import actions from 'redux/campaigns/actions';
import moment from 'moment';
import styles from './styles.module.scss';

const CampaignBreadcrumbsButtons = () => {
  const campaign = useSelector(state => state.campaigns.singleCampaign);
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
      {/* <div className={styles.buttons__progress}>
        <Progress percent={30} size="small" />
      </div> */}
      <Space>
        <Col>
          {!campaign.isLoading ? (
            <Skeleton.Input active />
          ) : (
            <DatePicker
              disabled={campaign.status === 'SCHEDULED'}
              value={campaign.startDateTime && moment(campaign.startDateTime)}
              placeholder="Scheduled at"
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              onChange={onDateChange}
            />
          )}
        </Col>
        <Col>
          {!campaign.isLoading ? (
            <Skeleton.Button active />
          ) : (
            <Button
              disabled={campaign.status !== 'DRAFT'}
              onClick={startCampaign}
              type="primary"
            >
              {campaign.status !== 'DRAFT' ? 'Sended' : 'Send'}
            </Button>
          )}
        </Col>
      </Space>
    </Row>
  );
};

export default CampaignBreadcrumbsButtons;
