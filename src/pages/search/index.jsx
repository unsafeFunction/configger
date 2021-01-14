import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/search/actions';
import { Input, Steps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import styles from './styles.module.scss';
import moment from 'moment-timezone';

moment.tz.setDefault('America/New_York');

const { Step } = Steps;

const Search = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchName, setSearchName] = useState('');

  const search = useSelector(state => state.search);

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_INFO_REQUEST,
        payload: {}
      });
    }, [dispatch]);
  };

  useFetching();

  const sendQuery = useCallback(
    query => {
      dispatch({
        type: actions.FETCH_INFO_REQUEST,
        payload: {
          search: query,
        },
      });
    },
    [dispatch],
  );

  const delayedQuery = useCallback(
    debounce(q => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(event => {
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

      <Steps direction="vertical" current={4} className={styles.stages}>
        <Step
          title="Stage 1: Intake"
          description={
            <div>
              <p>
                Company<span className="ml-3 text-primary">Some Name</span>
              </p>
              <p>
                Company ID<span className="ml-3 text-primary">123456789</span>
              </p>
              <p>
                Scan Date &amp; Time
                <span className="ml-3 text-primary">
                  {moment(undefined).format('DD MMM YYYY hh:mm A')}
                </span>
              </p>
              <p>
                Rack ID<span className="ml-3 text-primary">123456789</span>
              </p>
              <p>
                Tube Position<span className="ml-3 text-primary">8</span>
              </p>
              <p>
                Pool Name<span className="ml-3 text-primary">123456789</span>
              </p>
              <p>
                Pool ID<span className="ml-3 text-primary">123456789</span>
              </p>
            </div>
          }
        />
        <Step
          title="Stage 2: Pooling"
          description={
            <div>
              <p>
                Pool Rack Name
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Pool Rack ID<span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Pool Rack Scan Date &amp; Time
                <span className="ml-3 text-primary">
                  {moment(undefined).format('DD MMM YYYY hh:mm A')}
                </span>
              </p>
              <p>
                Pool Rack Position
                <span className="ml-3 text-primary">some data</span>
              </p>
            </div>
          }
        />
        <Step
          title="Stage 3: RNA Extraction"
          description={
            <div>
              <p>
                Sample Plate ID
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Sample Plate Name
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Sample Plate Position
                <span className="ml-3 text-primary">some data</span>
              </p>
            </div>
          }
        />
        <Step
          title="Stage 4: QPCR"
          description={
            <div>
              <p>
                Run Name
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Run Template
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Well Plate Positions
                <span className="ml-3 text-primary">some data</span>
              </p>
            </div>
          }
        />
        <Step
          title="Stage 5: Analysis"
          description={
            <div>
              <p>
                Raw Data
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Well Plate Positions 1/2/3
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                CQ Value
                <span className="ml-3 text-primary">some data</span>
              </p>
              <p>
                Interpretive Result
                <span className="ml-3 text-primary">some data</span>
              </p>
            </div>
          }
        />
        <Step
          title="Stage 6: Results"
          description={
            <div>
              <p>
                Published Pool Result
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Published Pool Result Date &amp; Time
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Published Subpool Result
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Published Subpool Result Date &amp; Time
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Diagnostic Result
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Diagnostic Result Date &amp; Time
                <span className="ml-3 text-primary">-</span>
              </p>
              <p>
                Diagnostic Result File
                <span className="ml-3 text-primary">-</span>
              </p>
            </div>
          }
        />
      </Steps>
    </>
  );
};

export default Search;
