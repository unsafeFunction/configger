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
  Pagination,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Rackboard from 'components/widgets/Rackboard';
import SingleSessionTable from 'components/widgets/SingleSessionTable';
import SingleScanInfo from 'components/widgets/SingleScanInfo';
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

  const [visibleActions, setVisibleActions] = useState(false);

  const scan = useSelector(state => state.scanSessions?.singleScan);
  const session = useSelector(state => state.scanSessions?.singleSession);

  const { sessionId, sessionSize, companyId, scanId } = history.location.state;
  const companyInfo = session?.company_short;

  const handleVoidScan = useCallback(() => {
    setVisibleActions(false);
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<CloseOutlined />}>
        <Popconfirm
          title="Are you sure to Void Scan?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleVoidScan}
        >
          Void Scan
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

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

  const handleSwitchVisibleActions = useCallback(() => {
    setVisibleActions(!visibleActions);
  }, [visibleActions]);

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
            End Scanning Session
          </Button>
        </Popconfirm>
        {/* </Form.Item> */}
      </div>

      <Form form={form} onFinish={onSubmit}>
        <Row gutter={[40, 48]}>
          <Col
            xs={24}
            sm={20}
            md={18}
            lg={16}
            xl={14}
            style={{ padding: '30px 20px 24px' }}
          >
            <div className="mb-4">
              <div className={styles.navigationWrapper}>
                <Button type="primary" htmlType="submit">
                  Save and Scan Another
                </Button>
                <div>
                  <Button className="mr-2" icon={<LeftOutlined />} />
                  <Button className="mr-2" icon={<RightOutlined />} />
                  <Dropdown
                    overlay={menu}
                    overlayClassName={styles.actionsOverlay}
                    onClick={handleSwitchVisibleActions}
                    visible={visibleActions}
                  >
                    <Button type="primary">
                      Actions 
{' '}
<DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <Rackboard rackboard={scan} scanId={scan?.id} />
            </div>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={6}>
                <Card className={styles.card}>
                  <Tooltip placement="bottom" title={scan?.rack_id}>
                    <Statistic
                      title="Rack ID"
                      groupSeparator=""
                      value={scan?.rack_id || '–'}
                      formatter={value => <Tag color="blue">{value}</Tag>}
                      className={classNames(styles.rackStat, styles.ellipsis)}
                    />
                  </Tooltip>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={5}>
                <Card className={styles.card}>
                  <Statistic
                    title="Pool ID"
                    groupSeparator=""
                    value={scan?.pool_id || '–'}
                    formatter={value => <Tag color="geekblue">{value}</Tag>}
                    className={classNames(styles.rackStat, styles.ellipsis)}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={5}>
                <Card className={styles.card}>
                  <Statistic
                    title="Status"
                    value={scan?.status?.toLowerCase()}
                    formatter={value => (
                      <Tag icon={<ArrowUpOutlined />} color="purple">
                        {value}
                      </Tag>
                    )}
                    className={classNames(styles.rackStat, styles.ellipsis)}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={4}>
                <Card className={styles.card}>
                  <Statistic
                    title="Tubes"
                    value={scan?.items?.length}
                    formatter={value => <Tag color="cyan">{value}</Tag>}
                    className={classNames(styles.rackStat, styles.ellipsis)}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={4}>
                <Card className={styles.card}>
                  <Statistic
                    title="Total Scans"
                    value={session?.scans?.length}
                    formatter={value => <Tag color="gold">{value}</Tag>}
                    className={classNames(styles.rackStat, styles.ellipsis)}
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
          <Col lg={18} xl={8}>
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
            <SingleScanInfo session={session} />
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
                {/* </Popconfirm> */}
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Scan;
