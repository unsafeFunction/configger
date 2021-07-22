import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Checkbox, Select, Tooltip, Typography } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import { getColor } from 'utils/highlightingResult';

const { Option } = Select;

const Target = ({ record, field, value }) => {
  const { reservedSamples } = constants;

  const formattedValue = (val) => {
    if (val && !isNaN(val)) {
      return parseFloat(val).toFixed(2);
    }
    return null;
  };

  const cqConfidence = formattedValue(record[`${field}_cq_confidence`]);
  const inconclusiveAmpStatus =
    record[`${field}_amp_status`] === constants.poolResults.inconclusive;

  const warning = () => {
    if (cqConfidence > 0 && cqConfidence <= 0.7 && inconclusiveAmpStatus) {
      return `Cq confidence is low! (${cqConfidence}) Amplification is inconclusive`;
    }
    if (cqConfidence > 0 && cqConfidence <= 0.7) {
      return `Cq confidence is low! (${cqConfidence})`;
    }
    if (inconclusiveAmpStatus) {
      return 'Amplification is inconclusive';
    }
    return null;
  };

  const meanTargetValue = () => {
    const mean = formattedValue(record.mean[field]);
    const deviation = formattedValue(record.standard_deviation[field]) ?? 'NA';
    return mean ? `${mean} (${deviation})` : null;
  };

  if (record.children || reservedSamples.includes(record.display_sample_id)) {
    return meanTargetValue();
  }
  if (warning()) {
    return (
      <Tooltip placement="right" title={warning()}>
        {formattedValue(value)}
        <ExclamationCircleTwoTone twoToneColor="orange" className="ml-1" />
      </Tooltip>
    );
  }
  return formattedValue(value);
};

Target.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const Actions = ({ record, field, value }) => {
  const dispatch = useDispatch();

  const { status: runStatus } = useSelector(
    (state) => state.analysisRuns.singleRun,
  );

  const options = [
    {
      label: 'Reflex SC',
      value: 'REFLEX_SC',
      disabled: value.length && value[0] !== 'REFLEX_SC',
    },
    {
      label: 'Reflec SD',
      value: 'REFLEX_SD',
      disabled: value.length && value[0] !== 'REFLEX_SD',
    },
    {
      label: 'Rerun',
      value: 'RERUN',
      disabled: value.length && value[0] !== 'RERUN',
    },
  ];

  const onSampleUpdate = useCallback(
    (id, field, value) => {
      dispatch({
        type: actions.UPDATE_SAMPLE_REQUEST,
        payload: {
          id,
          field,
          value: value ?? '',
        },
      });
    },
    [dispatch],
  );

  const onModalToggle = useCallback(
    (id, field, sample) => (checkedValues) => {
      dispatch({
        type: modalActions.SHOW_MODAL,
        modalType: 'COMPLIANCE_MODAL',
        modalProps: {
          title: 'Confirm action',
          onOk: () => onSampleUpdate(id, field, checkedValues[0]),
          bodyStyle: {
            maxHeight: '70vh',
            overflow: 'scroll',
          },
          okText: 'Update sample',
          message: () =>
            `Are you sure you would like to ${
              checkedValues[0] ? 'set' : 'unset'
            } ${checkedValues[0]} action for ${sample} sample?`,
        },
      });
    },
    [dispatch, onSampleUpdate],
  );

  return (
    <>
      {record.children && (
        <Checkbox.Group
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
        />
      )}
    </>
  );
};

Actions.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const resultList = Object.values(constants.poolResults).map((item) => {
  return {
    text: item.replaceAll('_', ' '),
    value: item,
  };
});

const ResultSelect = ({ record, field }) => {
  const { runStatuses, reservedSamples } = constants;

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
          value,
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
          message: () =>
            `Are you sure you would like to update sample ${sample} result to ${option.value}?`,
        },
      });
    },
    [dispatch, onResultUpdate],
  );

  return (
    <Select
      value={<ResultTag status={record[field]} type="pool" />}
      style={{ width: 175 }}
      onSelect={onModalToggle(
        record.sample_id,
        field,
        record.display_sample_id,
      )}
      loading={record[`${field}IsUpdating`]}
      disabled={
        record[`${field}IsUpdating`] ||
        runStatus === runStatuses.published ||
        reservedSamples.includes(record.display_sample_id)
      }
      bordered={false}
    >
      {resultList
        ?.filter((option) => option.value !== record[field])
        .map((item) => (
          <Option key={item.value} value={item.value}>
            <ResultTag status={item.value} type="pool" />
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
    dataIndex: 'rerun_action',
    width: 300,
    render: (value, record) => {
      return (
        <Actions
          record={record}
          field="rerun_action"
          value={value ? [...value] : []}
        />
      );
    },
  },
];

export default columns;
