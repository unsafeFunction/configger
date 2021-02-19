import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Form, Input, Select, Tag, DatePicker, Row, Col } from 'antd';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import actions from 'redux/scanSessions/actions';
import companyActions from 'redux/companies/actions';
import moment from 'moment-timezone';
import sortBy from 'lodash.sortby';
import { constants } from 'utils/constants';
import styles from './styles.module.scss';

const ScanSession = () => {
  const dispatch = useDispatch();
  const { items, total, isLoading } = useSelector(state => state.companies.all);
  const [page, setPage] = useState(0);
  const [value, onValueChange] = useState(null);

  const preparedData = items.map(item => {
    return {
      value: item.unique_id,
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

  const loadPage = page => {
    loadCompanies(page);
    setPage(page + 1);
  };

  const onChange = useCallback(value => {
    onValueChange(value);
  }, []);

  return (
    <div>
      <div className={classNames('air__utils__heading', styles.page__header)}>
        <h4>Session</h4>
      </div>
      <Row>
        <Col>
          <Select
            placeholder="Companies"
            size="middle"
            options={preparedData}
            loading={!isLoading}
            dropdownStyle={{
              maxHeight: 200,
              overflowY: 'hidden',
              overflowX: 'scroll',
            }}
            showArrow
            showSearch
            defaultValue={value ?? preparedData[0]}
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
      </Row>
    </div>
  );
};

export default ScanSession;
