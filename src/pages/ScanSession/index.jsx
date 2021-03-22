import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Select, Row, Col, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';
import actions from 'redux/scanSessions/actions';
import companyActions from 'redux/companies/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const ScanSession = () => {
  const dispatch = useDispatch();
  const { items, total, offset, isLoading } = useSelector(
    (state) => state.companies.all,
  );
  const { activeSessionId, isLoading: isSessionLoading } = useSelector(
    (state) => state.scanSessions.singleSession,
  );
  const [value, onValueChange] = useState(null);

  const [searchName, setSearchName] = useState('');

  const preparedData = items.map((item) => {
    return {
      value: item.company_id,
      label: item.name,
    };
  });

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SESSION_ID_REQUEST,
      });

      dispatch({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
        },
      });
    }, []);
  };

  useFetching();

  const startSession = useCallback(() => {
    dispatch({
      type: actions.CREATE_SESSION_REQUEST,
      payload: {
        companyId: value,
      },
    });
  }, [dispatch, value]);

  const onChange = useCallback((value) => {
    onValueChange(value);
  }, []);

  const loadMore = useCallback(() => {
    dispatch({
      type: companyActions.FETCH_COMPANIES_REQUEST,
      payload: {
        limit: constants.companies.itemsLoadingCount,
        offset,
        search: searchName,
      },
    });
  }, [dispatch, items, searchName]);

  const sendQuery = useCallback(
    (query) => {
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
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    (value) => {
      setSearchName(value);
      return delayedQuery(value);
    },
    [delayedQuery],
  );

  if (!isSessionLoading && activeSessionId) {
    return <Redirect to={`/session/${activeSessionId}`} />;
  }

  return (
    <div>
      <Row className="ml-auto">
        <Col xs={24} className="mb-4">
          <Select
            placeholder="Company"
            loading={!isLoading}
            showSearch
            options={preparedData}
            style={{ width: 400 }}
            dropdownStyle={{
              maxHeight: 300,
              overflowY: 'hidden',
              overflowX: 'scroll',
            }}
            listHeight={0}
            dropdownRender={(menu) => (
              <InfiniteScroll
                next={loadMore}
                hasMore={items.length < total}
                dataLength={items.length}
                height={300}
              >
                {menu}
              </InfiniteScroll>
            )}
            optionFilterProp="label"
            onSearch={onChangeSearch}
            searchValue={searchName}
            allowClear
            onChange={onChange}
          />
        </Col>
        <Col>
          <Button
            onClick={startSession}
            disabled={!value}
            loading={isSessionLoading}
            type="primary"
          >
            Start session
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ScanSession;
