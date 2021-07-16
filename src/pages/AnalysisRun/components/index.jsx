import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Checkbox, Popconfirm, Select, Tooltip, Typography } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/analysisRuns/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import { getColor } from 'utils/highlightingResult';

const { Option } = Select;

const Target = ({ record, field, value }) => {
  const formattedValue = (val) => {
    if (val && !isNaN(val)) {
      return parseFloat(val).toFixed(2);
    }
    if (value && isNaN(val)) {
      return 'NA';
    }
    return;
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

  return warning() ? (
    <Tooltip placement="right" title={warning()}>
      {formattedValue(value)}
      <ExclamationCircleTwoTone twoToneColor="orange" className="ml-1" />
    </Tooltip>
  ) : (
    <>{formattedValue(value)}</>
  );
};

Target.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const PoolCheckbox = ({ record, field, value, title }) => {
  const dispatch = useDispatch();

  const onPoolUpdate = useCallback(
    (id, field, value) => {
      dispatch({
        type: actions.UPDATE_POOL_REQUEST,
        payload: {
          id,
          field,
          value,
        },
      });
    },
    [dispatch],
  );

  return (
    <Popconfirm
      title={`Are you sure you would like to ${
        value ? 'unset' : 'set'
      } ${title} for ${record.pool_name} pool?`}
      onConfirm={() => onPoolUpdate(record.id, field, !value)}
      placement="topRight"
    >
      {record.children && (
        <Checkbox checked={value} disabled={record[`${field}IsUpdating`]} />
      )}
    </Popconfirm>
  );
};

PoolCheckbox.propTypes = {
  record: PropTypes.shape({}).isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

const resultList = Object.values(constants.poolResults).map((item) => {
  return {
    text: item.replaceAll('_', ' '),
    value: item,
  };
});

const ResultSelect = ({ record, field }) => {
  const dispatch = useDispatch();

  const onResultUpdate = useCallback(
    (id, field, value) => {
      dispatch({
        type: actions.UPDATE_POOL_REQUEST,
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
    (id, field, sampleId) => (_, option) => {
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
            `Are you sure you would like to update sample ${sampleId} result to ${option.value}?`,
        },
      });
    },
    [dispatch, onResultUpdate],
  );

  return (
    <Select
      value={<ResultTag status={record.result} type="pool" />}
      style={{ width: 175 }}
      onSelect={onModalToggle(record.id, field, record.sample_id)}
      loading={record[`${field}IsUpdating`]}
      disabled={record[`${field}IsUpdating`]}
      bordered={false}
    >
      {resultList
        ?.filter((option) => option.value !== record.result)
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
    dataIndex: 'sample_id',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    render: (_, record) => {
      return {
        children: record?.result ? (
          <ResultSelect record={record} field="result" />
        ) : null,
      };
    },
    filters: resultList,
    onFilter: (value, record) => record.result.indexOf(value) === 0,
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
    width: 75,
    render: (value, record) => {
      return <Target record={record} field="MS2" value={value} />;
    },
  },
  {
    title: 'N gene',
    dataIndex: 'N gene',
    width: 75,
    render: (value, record) => {
      return <Target record={record} field="N gene" value={value} />;
    },
  },
  {
    title: 'S gene',
    dataIndex: 'S gene',
    width: 75,
    render: (value, record) => {
      return <Target record={record} field="S gene" value={value} />;
    },
  },
  {
    title: 'Orf1ab',
    dataIndex: 'ORF1ab',
    width: 75,
    render: (value, record) => {
      return <Target record={record} field="ORF1ab" value={value} />;
    },
  },
  {
    title: 'RP',
    dataIndex: 'RP',
    width: 75,
    render: (value, record) => {
      return <Target record={record} field="RP" value={value} />;
    },
  },
  {
    title: 'Reflex SC',
    dataIndex: 'reflex_sc',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          field="reflex_sc"
          value={value}
          title="Reflex SC"
        />
      );
    },
  },
  {
    title: 'Reflex SD',
    dataIndex: 'reflex_sd',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          field="reflex_sd"
          value={value}
          title="Reflex SD"
        />
      );
    },
  },
  {
    title: 'Rerun',
    dataIndex: 'rerun',
    align: 'center',
    render: (value, record) => {
      return (
        <PoolCheckbox
          record={record}
          field="rerun"
          value={value}
          title="Rerun"
        />
      );
    },
  },
];

export default columns;
