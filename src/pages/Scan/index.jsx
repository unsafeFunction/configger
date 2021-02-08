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
import LabeledInput from './Labeled';

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
          <Col xs={24} sm={20} md={18} lg={16} xl={14}>
              <Rackboard rackboard={scan} />
              <Space size={100} className={styles.rackDetailsWrapper}>
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
                <Statistic
                  className={styles.rackDetails}
                  valueStyle={{fontSize: '32px'}}
                  title="Tubes"
                  value={scan?.items?.length}
                />
              </Space>
          </Col>
          <Col xs={24} sm={20} md={18} lg={8} xl={6}>
            <div className={styles.companyDetails}>
              <LabeledInput title={'Company:'} node={<Form.Item
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
              </Form.Item>}/>
              <Statistic
                className={styles.companyDetailsStat}
                title={'Short company name:'}
                value={selectedCompany?.name_short || '–'}
              />
              <Statistic
                className={styles.companyDetailsStat}
                title={'Company ID:'}
                value={selectedCompany?.company_id || '–'}
              />
              <LabeledInput title={'Pool name:'} node={
                <Form.Item
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
              }/>
              <Statistic
                className={styles.companyDetailsStat}
                valueStyle={{fontSize: '24px'}}
                title="Most Recent Scan"
                value="Name here"
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={18} lg={16} xl={14}>
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
            <div className={styles.barcodeWrapper}>
              <Barcode />
            </div>
          </Col>
          <Col xs={24} sm={20} md={18} lg={8} xl={7}>
          <div className={styles.submitBtns}>
              <div>
                <Form.Item className="d-inline-block mb-2 mr-2">
                  <Button type="primary" size="large" htmlType="submit">
                    Next Scan
                  </Button>
                </Form.Item>
                <Form.Item className="d-inline-block mb-2 mr-2">
                  <Popconfirm
                    title="Are you sure?"
                    okText="Yes"
                    cancelText="No"
                    // onConfirm={}
                  >
                    <Button size="large">Void Scan</Button>
                  </Popconfirm>
                </Form.Item>
                <Form.Item className="d-inline-block mb-2 mr-2">
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
