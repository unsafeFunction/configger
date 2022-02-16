import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Steps } from 'antd';
import Loader from 'components/layout/Loader';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { constants } from 'utils/constants';
import actions from 'redux/search/actions';
import useCustomFilters from 'utils/useCustomFilters';
import { roundValueToSecondNumber } from 'utils/roundRules';
import styles from './styles.module.scss';

const { Step } = Steps;

const Search = () => {
  const dispatch = useDispatch();

  const initialFiltersState = {
    search: '',
  };

  const [filtersState, filtersDispatch] = useCustomFilters(initialFiltersState);

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

  const delayedQuery = useMemo(() => debounce((q) => sendQuery(q), 1000), [
    sendQuery,
  ]);

  useEffect(() => {
    return () => {
      delayedQuery.cancel();
    };
  }, [delayedQuery]);

  const onChangeSearch = (event) => {
    const { target } = event;

    filtersDispatch({
      type: 'setValue',
      payload: {
        name: 'search',
        value: target.value,
      },
    });

    return delayedQuery(target.value);
  };

  return (
    <>
      <Input
        size="middle"
        prefix={<SearchOutlined />}
        className={styles.search}
        placeholder="Enter barcode..."
        value={filtersState.search}
        onChange={onChangeSearch}
      />
      {!filtersState.search && (
        <div className={styles.emptyPlaceholder}>
          <p>
            Start typing for search <SearchOutlined />
          </p>
        </div>
      )}
      {filtersState.search && search?.items?.length > 0 && !search.isLoading && (
        <Steps
          direction="vertical"
          current={search.current - 1}
          className={styles.stages}
        >
          {search?.items?.map((step, stepIdx) => (
            <Step
              title={step.title}
              key={step.title}
              description={
                <div>
                  {step.data?.map?.((info) => (
                    <p key={info.title}>
                      {info.title}
                      <span
                        className={`ml-3 ${
                          stepIdx !== search.current - 1
                            ? 'text-muted'
                            : 'text-primary'
                        }`}
                      >
                        {info.title === constants.barcodeTitles.cqValue
                          ? roundValueToSecondNumber(info.value)
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
      {filtersState.search && search.isLoading && <Loader />}
      {filtersState.search && !search?.items?.length && !search.isLoading && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default Search;
