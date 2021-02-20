import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Select, Row, Col, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import actions from 'redux/scanSessions/actions';
import companyActions from 'redux/companies/actions';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const ScanSession = () => {
  const dispatch = useDispatch();
  const { items, total, isLoading } = useSelector(state => state.companies.all);
  const { activeSessionId, isLoading: isSessionLoading } = useSelector(
    state => state.scanSessions.singleSession,
  );
  const [page, setPage] = useState(0);
  const [value, onValueChange] = useState(null);

  const preparedData = items.map(item => {
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
          page,
          search: null,
          limit: constants.companies.itemsLoadingCount,
        },
      });
    }, []);
  };

  useFetching();

  const loadCompanies = page => {
    dispatch({
      type: companyActions.FETCH_COMPANIES_REQUEST,
      payload: {
        page,
        search: null,
        limit: constants.companies.itemsLoadingCount,
      },
    });
  };

  const startSession = useCallback(() => {
    dispatch({
      type: actions.CREATE_SESSION_REQUEST,
      payload: {
        companyId: value,
      },
    });
  }, [dispatch, value]);

  const loadPage = page => {
    loadCompanies(page);
    setPage(page + 1);
  };

  const onChange = useCallback(value => {
    onValueChange(value);
  }, []);

  if (!isSessionLoading && activeSessionId) {
    return <Redirect to={`/scan-sessions/${activeSessionId}`} />;
  }

  return (
    <div>
      <Row className="ml-auto">
        <Col xs={24} className="mb-4">
          <Select
            placeholder="Companies"
            size="middle"
            options={preparedData}
            loading={!isLoading}
            style={{ width: 400 }}
            dropdownStyle={{
              maxHeight: 200,
              overflowY: 'hidden',
              overflowX: 'scroll',
            }}
            showArrow
            showSearch
            // defaultValue={value ?? preparedData[0]}
            onChange={onChange}
            dropdownMatchSelectWidth={false}
            dropdownRender={menu => {
              return (
                <div className={styles.dropDown}>
                  <InfiniteScroll
                    pageStart={page}
                    loadMore={() => loadPage(page)}
                    hasMore={!isLoading && items?.length < total}
                    threshold={200}
                    useWindow={false}
                  >
                    {menu}
                  </InfiniteScroll>
                </div>
              );
            }}
          />
        </Col>
        <Col>
          <Button onClick={startSession} type="primary">
            Start session
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ScanSession;
