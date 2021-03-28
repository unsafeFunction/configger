import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/search/actions';
import { Empty, Input, Steps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import styles from './styles.module.scss';
import moment from 'moment-timezone';
import Loader from 'components/layout/Loader';

moment.tz.setDefault('America/New_York');

const { Step } = Steps;

const Search = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');

  const search = useSelector((state) => state.search);

  const sendQuery = useCallback(
    (query) => {
      if (query) {
        dispatch({
          type: actions.FETCH_INFO_REQUEST,
          payload: {
            search: query,
          },
        });
      }
    },
    [dispatch],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback((event) => {
    setSearchName(event.target.value);
    delayedQuery(event.target.value);
  }, []);

  return (
    <>
      <Input
        size="middle"
        prefix={<SearchOutlined />}
        className={styles.search}
        placeholder="Enter barcode..."
        value={searchName}
        onChange={onChangeSearch}
      />
      {!searchName && (
        <div className={styles.emptyPlaceholder}>
          <p>
            Start typing for search <SearchOutlined />
          </p>
        </div>
      )}
      {searchName && search?.items?.length > 0 && !search.isLoading && (
        <Steps
          direction="vertical"
          current={search.current}
          className={styles.stages}
        >
          {search?.items?.map((step, stepIdx) => (
            <Step
              title={step.title}
              key={step.title}
              description={
                <div>
                  {step.data.map((info) => (
                    <p>
                      {info.title}
                      <span
                        className={`ml-3 ${
                          stepIdx !== search.current
                            ? 'text-muted'
                            : 'text-primary'
                        }`}
                      >
                        {info.id === 'company_date'
                          ? moment(info.value).format('YYYY-MM-DD')
                          : info.value}
                      </span>
                    </p>
                  ))}
                </div>
              }
            />
          ))}
        </Steps>
      )}
      {searchName && search.isLoading && <Loader />}
      {searchName && !search?.items?.length && !search.isLoading && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default Search;
