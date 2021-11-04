/* eslint-disable react/jsx-one-expression-per-line */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Radio, Select, Tooltip, Typography } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { isReservedSample, roundValue } from 'utils/analysisRules';
import { constants } from 'utils/constants';
import { getColor } from 'utils/highlighting';

const { Option } = Select;

const Warning = ({ message, targetValue }) => (
  <Tooltip placement="right" title={message}>
    {targetValue}
    <ExclamationCircleTwoTone twoToneColor="orange" className="ml-1" />
  </Tooltip>
);

Warning.propTypes = {
  message: PropTypes.string.isRequired,
  targetValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const Target = ({ record, field, value }) => {
  const targetValue = () => {
    if (record?.mean) {
      const mean = roundValue(record?.mean?.[field]);
      const deviation = roundValue(record?.standard_deviation?.[field]) ?? 'NA';
      return mean ? `${mean} (${deviation})` : null;
    }
    if (record[field] && !isNaN(record[field])) {
      const cqConfidence = roundValue(record[`${field}_cq_confidence`]);
      const inconclusiveAmpStatus =
        record[`${field}_amp_status`] === constants.poolResults.inconclusive;

      if (cqConfidence > 0 && cqConfidence <= 0.7 && inconclusiveAmpStatus) {
        return (
          <Warning
            message={`Cq confidence is low! (${cqConfidence}) Amplification is inconclusive`}
            targetValue={roundValue(value)}
          />
        );
      }
      if (cqConfidence > 0 && cqConfidence <= 0.7) {
        return (
          <Warning
            message={`Cq confidence is low! (${cqConfidence})`}
            targetValue={roundValue(value)}
          />
        );
      }
      if (inconclusiveAmpStatus) {
        return (
          <Warning
            message="Amplification is inconclusive"
            targetValue={roundValue(value)}
          />
        );
      }
      return roundValue(value);
    }
    return null;
  };

  return targetValue();
};

Target.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const Actions = ({ record, field, value = '' }) => {
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
      label: 'Reflex SC',
      value: 'REFLEX_SC',
    },
    {
      label: 'Reflex SD',
      value: 'REFLEX_SD',
    },
    {
      label: 'Rerun',
      value: 'RERUN',
    },
    {
      label: 'Do not publish',
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
            runStatus === constants.runStatuses.published
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
          onOk: () => onResultUpdate(id, field, option.key),
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
      value={<ResultTag status={record[field]} type="sample" />}
      onSelect={onModalToggle(
        record.sample_id,
        field,
        record.display_sample_id,
      )}
      loading={record[`${field}IsUpdating`]}
      disabled={
        record[`${field}IsUpdating`] ||
        runStatus === runStatuses.published ||
        isReservedSample(record.display_sample_id)
      }
      bordered={false}
      dropdownMatchSelectWidth={200}
    >
      {resultList
        ?.filter((option) => option.value !== record[field])
        .map((item) => (
          <Option key={item.value} value={item.value}>
            <ResultTag status={item.value} type="sample" />
          </Option>
        ))}
    </Select>
  );
};

ResultSelect.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
};

const columns = [
  {
    title: 'Company Short',
    dataIndex: 'company_short',
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
    // TODO: future feature
    // render: (value, record) => {
    //   return (
    //     <Tooltip
    //       placement="right"
    //       title={`Pool size: ${record.pool_size ?? 'Unknown'}`}
    //     >
    //       {value}
    //     </Tooltip>
    //   );
    // },
  },
  {
    title: 'Sample ID',
    dataIndex: 'display_sample_id',
  },
  {
    title: 'Result',
    dataIndex: 'analysis_result',
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
      const formattedResult = value?.replaceAll('_', ' ').toLowerCase();
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
  {
    title: 'Wells',
    dataIndex: 'wells',
  },
  {
    title: 'MS2',
    dataIndex: 'MS2',
    width: 100,
    render: (value, record) => {
      return <Target record={record} field="MS2" value={value} />;
    },
  },
  {
    title: 'N gene',
    dataIndex: 'N gene',
    width: 100,
    render: (value, record) => {
      return <Target record={record} field="N gene" value={value} />;
    },
  },
  {
    title: 'S gene',
    dataIndex: 'S gene',
    width: 100,
    render: (value, record) => {
      return <Target record={record} field="S gene" value={value} />;
    },
  },
  {
    title: 'Orf1ab',
    dataIndex: 'ORF1ab',
    width: 100,
    render: (value, record) => {
      return <Target record={record} field="ORF1ab" value={value} />;
    },
  },
  {
    title: 'RP',
    dataIndex: 'RP',
    width: 100,
    render: (value, record) => {
      return <Target record={record} field="RP" value={value} />;
    },
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 460,
    render: (_, record) => {
      return (
        <Actions
          record={record}
          field="actions"
          value={record.auto_publish ? record.rerun_action : 'DO_NOT_PUBLISH'}
        />
      );
    },
  },
];

export default columns;
