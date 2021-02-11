import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  Typography,
  Popconfirm,
  Statistic,
  Card,
  Tag,
  Table,
} from 'antd';
import Rackboard from 'components/widgets/Rackboard';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment-timezone';
import styles from './styles.module.scss';

moment.tz.setDefault('America/New_York');

const { Title, Text } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const scan = useSelector(state => state.scanSessions?.singleScan);
  const session = useSelector(state => state.scanSessions?.singleSession);

  const { sessionId, sessionSize, companyId, scanId } = history.location.state;
  const companyInfo = session?.company_short;

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SCAN_BY_ID_REQUEST,
        payload: { scanId },
      });
      dispatch({
        type: actions.FETCH_SCAN_SESSION_BY_ID_REQUEST,
        payload: { sessionId },
      });
    }, [dispatch]);
  };

  useFetching();

  const onSubmit = useCallback(
    values => {
      console.log('VALUES', values);
      // dispatch({
      //   type: actions.UPDATE_SESSION_REQUEST,
      //   payload: {
      //     ...values,
      //   },
      // });
    },
    [dispatch],
  );

  return (
    <>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <Title level={4} className="font-weight-normal">
          Scan on 
{' '}
{moment(scan?.scan_timestamp)?.format('LLLL')}
          <Text mark className="pl-3 pr-3">
            {scan?.scan_order + 1}
{' '}
/{sessionSize}
          </Text>
          <Tag color="purple">{scan?.status}</Tag>
        </Title>

        {/* <Form.Item className="d-inline-block mb-2 mr-2"> */}
        <Popconfirm
          title="Are you sure to Mark Complete this Scan Session?"
          okText="Yes"
          cancelText="No"
          disabled
          // onConfirm={}
        >
          <Button disabled className="mb-2">
            Mark Complete
          </Button>
        </Popconfirm>
        {/* </Form.Item> */}
      </div>

      <Form form={form} onFinish={onSubmit}>
        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={18} lg={16} xl={14}>
            <div className="mb-4">
              <Rackboard rackboard={scan} scanId={scan?.id} />
            </div>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={9}>
                <Card>
                  <Statistic
                    title="Rack ID"
                    value={scan?.rack_id || '–'}
                    className={styles.rackStat}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={9}>
                <Card>
                  <Statistic
                    title="Pool ID"
                    value={scan?.pool_id || '–'}
                    className={styles.rackStat}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Tubes"
                    value={scan?.items?.length}
                    className={styles.rackStat}
                  />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm={24}>
                <SingleSessionTable session={session} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={20} md={18} lg={8} xl={6}>
            <div className={styles.companyDetails}>
              <Statistic
                className={styles.companyDetailsStat}
                title="Company name:"
                value={companyInfo?.name || '–'}
              />
              <Statistic
                className={styles.companyDetailsStat}
                title="Short company name:"
                value={companyInfo?.name_short || '–'}
              />
              <Statistic
                className={styles.companyDetailsStat}
                title="Company ID:"
                groupSeparator=""
                value={companyInfo?.company_id || '–'}
              />
              <Statistic
                className={styles.companyDetailsStat}
                title="Pool name:"
                value={`${moment(scan?.scan_timestamp)?.format('dddd')?.[0]}${
                  scan?.scan_order
                }`}
              />
              <Statistic
                className={styles.companyDetailsStat}
                title="Most Recent Scan:"
                value="Name here"
              />
            </div>
          </Col>
        </Row>
        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={18} lg={16} xl={14} />
          <Col xs={24} sm={20} md={18} lg={8} xl={6}>
            <div className={styles.submitBtns}>
              <Form.Item>
                {/* <Popconfirm
                  title="Are you sure to Save Scan and go to the next?"
                  okText="Yes"
                  cancelText="No"
                  // onConfirm={}
                > */}
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="mr-2 mb-2"
                >
                  Next Scan
                </Button>
                {/* </Popconfirm> */}
              </Form.Item>
              <Form.Item>
                <Popconfirm
                  title="Are you sure to Void Scan?"
                  okText="Yes"
                  cancelText="No"
                  // onConfirm={}
                >
                  <Button size="large" danger className="mr-2 mb-2">
                    Void Scan
                  </Button>
                </Popconfirm>
              </Form.Item>
            </div>
            <div>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="mr-2 mb-2"
              >
                Prev
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="mr-2 mb-2"
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Scan;
