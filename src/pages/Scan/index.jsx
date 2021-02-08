import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scanSessions/actions';
import companyActions from 'redux/companies/actions';
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  Typography,
  Input,
  Space,
  Popconfirm,
  Statistic,
} from 'antd';
import Rackboard from 'components/widgets/rackboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { constants } from 'utils/constants';
import debounce from 'lodash.debounce';
import { Barcode } from 'assets';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.scss';

const { Text } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [searchName, setSearchName] = useState('');
  const [selectedCompany, setCompany] = useState(null);

  const scan = useSelector(state => state.scanSessions?.singleScan);
  const companies = useSelector(state => state.companies.all);
  const companiesForSelect = companies?.items.map(company => {
    return {
      ...company,
      key: company.company_id,
      label: company.name,
      value: company.company_id,
      fullvalue: company,
    };
  });
  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_POOL_SCAN_BY_ID_REQUEST,
        payload: {
          poolScanId: history.location.pathname.split('/')[2],
          sortBy: 'tube_position',
        },
      });
      dispatch({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants?.companies?.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: companyActions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants?.companies?.itemsLoadingCount,
        offset: companies?.offset,
        search: searchName,
      },
    });
  }, [dispatch, companies.items, searchName]);

  const sendQuery = useCallback(
    query => {
      dispatch({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants?.companies?.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch, searchName],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(value => {
    setSearchName(value);
    delayedQuery(value);
  }, []);

  const onSubmit = useCallback(
    values => {
      console.log('VALUES', values);
      // dispatch({
      //   type: ,
      //   payload: {
      //     ...values,
      //   },
      // });
    },
    [dispatch],
  );

  return (
    <>
      <Form
        form={form}
        // initialValues={{ company: rackboard?.company_id }}
        onFinish={onSubmit}
      >
        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={18} lg={16} xl={10}>
            <Row>
              <Col xs={21} sm={21} md={21} lg={21} xl={21}>
              <Rackboard rackboard={scan} />
              <Space className={styles.rackDetailsWrapper}>
                <Statistic
                  className={styles.rackDetails}
                  valueStyle={{fontSize: '24px'}}
                  title="Rack ID:"
                  value={scan?.rack_id || '–'}
                />
                <Statistic
                  className={styles.rackDetails}
                  valueStyle={{fontSize: '24px'}}
                  title="Pool ID:"
                  value={scan?.pool_id || '–'}
                />
              </Space>
              </Col>
              <Col xs={3} sm={3} md={3} lg={3} xl={3} className={styles.tubesCountWrapper}>
                <Statistic
                  className={styles.tubesCount}
                  valueStyle={{fontSize: '48px'}}
                  title="Tubes"
                  value={scan?.items?.length}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={20} md={18} lg={8} xl={10}>
            <div className={styles.companyDetails}>
              <Form.Item
                label="Company"
                name="company"
                className="w-100"
                rules={[
                  {
                    required: true,
                    message: 'Please select a company',
                  },
                ]}
              >
                <Select
                  placeholder="Company"
                  loading={!companies?.isLoading}
                  showSearch
                  options={companiesForSelect}
                  dropdownStyle={{
                    maxHeight: 300,
                    overflowY: 'hidden',
                    overflowX: 'scroll',
                  }}
                  listHeight={0}
                  dropdownMatchSelectWidth={false}
                  dropdownRender={menu => (
                    <InfiniteScroll
                      next={loadMore}
                      hasMore={companies?.items?.length < companies?.total}
                      dataLength={companies?.items?.length}
                      height={300}
                    >
                      {menu}
                    </InfiniteScroll>
                  )}
                  optionFilterProp="label"
                  onSearch={onChangeSearch}
                  searchValue={searchName}
                  allowClear
                  onChange={(_, option) => {
                    option ? setCompany(option.fullvalue) : setCompany(null);
                  }}
                />
              </Form.Item>
              <Text>
                <span className="mr-2">Short company name:</span>
                {selectedCompany?.name_short || '–'}
              </Text>
              <Text>
                <span className="mr-2">Company ID:</span>
                {selectedCompany?.company_id || '–'}
              </Text>
              <Form.Item
                label="Pool name"
                name="poolName"
                rules={[
                  {
                    required: true,
                    message: 'Please input Pool name',
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={18} lg={12} xl={10}>
            <Form.Item
              name="companyConfirmation"
              dependencies={['company']}
              rules={[
                {
                  required: true,
                  message: 'Please select a company',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('company') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      'Please select a company in two places',
                    );
                  },
                }),
              ]}
            >
              <Select
                placeholder="Company"
                loading={!companies?.isLoading}
                showSearch
                options={companiesForSelect}
                dropdownStyle={{
                  maxHeight: 300,
                  overflowY: 'hidden',
                  overflowX: 'scroll',
                }}
                listHeight={0}
                dropdownMatchSelectWidth={false}
                dropdownRender={menu => (
                  <InfiniteScroll
                    next={loadMore}
                    hasMore={companies?.items?.length < companies?.total}
                    dataLength={companies?.items?.length}
                    height={300}
                  >
                    {menu}
                  </InfiniteScroll>
                )}
                optionFilterProp="label"
                onSearch={onChangeSearch}
                searchValue={searchName}
                allowClear
              />
            </Form.Item>
            <Barcode />
          </Col>
          <Col xs={24} sm={20} md={18} lg={12} xl={10}>
            <Text>Most recent scan</Text>
            <div className={styles.submitBtns}>
              <div>
                <Form.Item className="d-inline-block mr-3 mb-4">
                  <Popconfirm
                    title="Are you sure?"
                    okText="Yes"
                    cancelText="No"
                    // onConfirm={}
                  >
                    <Button size="large">Void Scan</Button>
                  </Popconfirm>
                </Form.Item>

                <Form.Item className="d-inline-block mb-4">
                  <Button type="primary" size="large" htmlType="submit">
                    Accept Scan
                  </Button>
                </Form.Item>
              </div>
              <div>
                <Form.Item className="mb-4">
                  <Popconfirm
                    title="Are you sure?"
                    okText="Yes"
                    cancelText="No"
                    disabled
                    // onConfirm={}
                  >
                    <Button size="large" disabled>
                      Mark Complete
                    </Button>
                  </Popconfirm>
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Scan;
