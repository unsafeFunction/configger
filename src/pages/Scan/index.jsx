import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/scan/actions';
import { Row, Col, Form, Select, Button, Typography } from 'antd';
import Rackboard from 'components/widgets/rackboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { constants } from 'utils/constants';
import debounce from 'lodash.debounce';
import styles from './styles.module.scss';

const { Text } = Typography;

const Scan = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [searchName, setSearchName] = useState('');
  const rackboard = useSelector(state => state.scan?.rackboard);
  const companies = useSelector(state => state.scan?.companies);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SAMPLES_REQUEST,
      });
      dispatch({
        type: actions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants?.companies?.itemsLoadingCount,
        },
      });
    }, [dispatch]);
  };

  useFetching();

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants?.companies?.itemsLoadingCount,
        offset: companies?.offset,
        search: searchName,
      },
    });
  }, [dispatch, companies, searchName]);

  const sendQuery = useCallback(
    query => {
      dispatch({
        type: actions.FETCH_COMPANIES_REQUEST,
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
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={[40, 48]} justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Rackboard rackboard={rackboard} />
            <Form.Item
              label="Company"
              name="company"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: 'Please select a company!',
                },
              ]}
            >
              <Select
                placeholder="Company"
                loading={companies?.isLoading}
                showSearch
                options={companies?.items}
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
          </Col>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <div className={styles.companyDetails}>
              <Form.Item
                label="Company"
                name="companyConfirmation"
                className={styles.formItem}
                dependencies={['company']}
                rules={[
                  {
                    required: true,
                    message: 'Please select a company!',
                  },
                ]}
                rules={[
                  {
                    required: true,
                    message: 'Please select the company again!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('company') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'The company that you selected does not match with the this one!',
                      );
                    },
                  }),
                ]}
              >
                <Select
                  placeholder="Company"
                  loading={companies?.isLoading}
                  showSearch
                  options={companies?.items}
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
              <Text>Short company name</Text>
              <Text>Company ID</Text>
              <Text>Pool name</Text>
            </div>

            <Form.Item className="d-inline-block mr-3 mb-3">
              <Button type="primary" size="large">
                Mark Complete
              </Button>
            </Form.Item>

            <Form.Item className="d-inline-block mr-3 mb-3">
              <Button type="primary" size="large" htmlType="submit">
                Save Scan
              </Button>
            </Form.Item>

            <Form.Item className="d-inline-block mr-3 mb-3">
              <Button size="large">Void Scan</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Scan;
