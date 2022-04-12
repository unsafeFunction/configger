/* eslint-disable camelcase */
/* eslint-disable react/jsx-one-expression-per-line */
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Popover, Radio, Select, Tooltip, Typography } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { isReservedSample } from 'utils/analysisRules';
import { roundValueToSecondNumber } from 'utils/roundRules';
import { constants } from 'utils/constants';
import { getColor } from 'utils/highlighting';
import { rowCounter } from 'utils/tableFeatures';
import styles from './styles.module.scss';
import moment from 'moment-timezone';

const warningFlag = (
  <ExclamationCircleFilled style={{ color: '#f39834' }} className="ml-1" />
);

export const Actions = ({ record, field, value = '' }) => {
  const { runStatuses, tubeTypes } = constants;
  const dispatch = useDispatch();

  const { status: runStatus } = useSelector(
    (state) => state.analysisRuns.singleRun,
  );

  const options = [
    {
      label: 'None',
      value: '',
    },
    {
      label: 'Reflex',
      value: 'REFLEX_SC',
      disabled: record.tube_type === tubeTypes.individual,
    },
    {
      label: 'Rerun',
      value: 'RERUN',
    },
    {
      label: 'Ignore',
      value: 'DO_NOT_PUBLISH',
    },
  ];

  const onSampleUpdate = useCallback(
    (id, field, value) => {
      const formatValues = () => {
        if (value === 'DO_NOT_PUBLISH') {
          return {
            rerun_action: '',
            auto_publish: false,
          };
        }
        return {
          rerun_action: value,
          auto_publish: true,
        };
      };

      dispatch({
        type: actions.UPDATE_SAMPLE_REQUEST,
        payload: {
          id,
          field,
          values: formatValues(),
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(
    (id, field, sample) => (e) => {
      const { value } = e.target;

      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Confirm action',
          onOk: () => onSampleUpdate(id, field, value),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update sample',
          message: () =>
            `Are you sure you would like to ${
              value ? `set ${value.replaceAll('_', ' ')}` : 'unset'
            } option for ${sample} sample?`,
        },
      });
    },
    [dispatch, onSampleUpdate],
  );

  return (
    <>
      {record.children && (
        <Radio.Group
          value={value}
          options={options}
          disabled={
            record[`${field}IsUpdating`] ||
            runStatus === runStatuses.qpcr ||
            runStatus === runStatuses.published
          }
          onChange={onModalToggle(
            record.sample_id,
            field,
            record.display_sample_id,
          )}
          optionType="button"
        />
      )}
    </>
  );
};

Actions.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const resultList = Object.values(constants.poolResults).map((item) => {
  return {
    text: item.replaceAll('_', ' '),
    value: item,
  };
});

const ResultSelect = ({ record, field }) => {
  const { runStatuses } = constants;

  const dispatch = useDispatch();

  const { status: runStatus } = useSelector(
    (state) => state.analysisRuns.singleRun,
  );

  const onResultUpdate = useCallback(
    (id, field, value) => {
      dispatch({
        type: actions.UPDATE_SAMPLE_REQUEST,
        payload: {
          id,
          field,
          values: {
            [field]: value,
          },
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(
    (id, field, sample) => (_, option) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Confirm action',
          onOk: () => onResultUpdate(id, field, option.value),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update result',
          message: () => (
            <Typography>
              Are you sure you would like to update {sample} sample result to
              <ResultTag status={option.value} type="sample" />?
            </Typography>
          ),
        },
      });
    },
    [dispatch, onResultUpdate],
  );

  return (
    <Select
      value={record[field]}
      options={resultList.map((item) => {
        return {
          label: <ResultTag status={item.value} type="sample" />,
          value: item.value,
        };
      })}
      onSelect={onModalToggle(
        record.sample_id,
        field,
        record.display_sample_id,
      )}
      loading={record[`${field}IsUpdating`]}
      disabled={
        record[`${field}IsUpdating`] ||
        runStatus === runStatuses.qpcr ||
        runStatus === runStatuses.published ||
        isReservedSample(record.display_sample_id)
      }
      bordered={false}
      dropdownMatchSelectWidth={200}
    />
  );
};

ResultSelect.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
};

export const getTargetColumns = (method) => {
  return constants.targets?.[method.toLowerCase()].map((target) => {
    return {
      title: target,
      dataIndex: target,
      width: 100,
      render: (_, record) => {
        if (record.mean) {
          const mean = roundValueToSecondNumber(record.mean?.[target]);
          const standardDeviation =
            roundValueToSecondNumber(record.standard_deviation?.[target]) ??
            'NA';
          return mean ? `${mean} (${standardDeviation})` : null;
        }
        if (record[target] && record[`${target}_warning_msg`]) {
          return (
            <Tooltip placement="right" title={record[`${target}_warning_msg`]}>
              {roundValueToSecondNumber(record[target])}
              {warningFlag}
            </Tooltip>
          );
        }
        return roundValueToSecondNumber(record[target]);
      },
    };
  });
};

export const WellsColumn = {
  title: 'Wells',
  dataIndex: 'wells',
  ellipsis: true,
  render: (value, record) => {
    const wells = (
      <Typography.Text className="text-primary">
        {value}
        {record.warning_flag && <sup>{warningFlag}</sup>}
      </Typography.Text>
    );

    if (value.length > 20) {
      return (
        <Popover
          content={value}
          trigger="hover"
          overlayClassName={styles.popover}
          placement="right"
        >
          {wells}
        </Popover>
      );
    }
    return wells;
  },
  filters: [
    {
      text: <Typography.Text>With warnings {warningFlag}</Typography.Text>,
      value: true,
    },
  ],
  filterMultiple: false,
  onFilter: (_, record) => record.warning_flag,
};

const columns = [
  {
    ...rowCounter,
    width: 70,
  },
  {
    title: 'Company Short',
    dataIndex: 'company_short',
    fixed: true,
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
  },
  {
    title: 'Pool Size',
    dataIndex: 'pool_size',
    render: (value) => value || '-',
  },
  {
    title: 'Sample ID',
    dataIndex: 'display_sample_id',
    render: (value, { tube_type }) => {
      return (
        <Popover
          content={tube_type ? `${tube_type} tube` : 'Undetermined tube type'}
          trigger="hover"
          placement="right"
        >
          {value}
        </Popover>
      );
    },
  },
  {
    title: 'Result',
    dataIndex: 'analysis_result',
    width: 190,
    render: (_, record) => {
      return {
        children: record?.analysis_result ? (
          <ResultSelect record={record} field="analysis_result" />
        ) : null,
      };
    },
    filters: resultList,
    onFilter: (value, record) => record.analysis_result.indexOf(value) === 0,
  },
  {
    title: 'Interpreted Result',
    dataIndex: 'result_interpreted',
    render: (value) => {
      const formattedResult = value?.replaceAll('_', ' ')?.toLowerCase();
      return (
        <Typography.Text
          style={{
            color: getColor(value),
            textTransform: 'capitalize',
          }}
        >
          {formattedResult}
        </Typography.Text>
      );
    },
  },
];

export default columns;
