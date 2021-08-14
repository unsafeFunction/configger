import { Checkbox } from 'antd';
import ResultTag from 'components/widgets/ResultTag';
import React from 'react';

const columns = [
  {
    title: 'Company Short',
    dataIndex: 'company_short_name',
  },
  {
    title: 'Pool Name',
    dataIndex: 'pool_name',
    width: 100,
  },
  {
    title: 'Tube Type',
    dataIndex: 'tube_type',
  },
  {
    title: 'Sample ID',
    dataIndex: 'sample_id',
    // TODO: uncomment when API endpoint will be ready
    // render: (value) => (
    //   <Link to={`/reflex-list/${value}`} className="text-blue">
    //     {value}
    //   </Link>
    // ),
  },
  {
    title: 'Result',
    dataIndex: 'analysis_result',
    width: 150,
    render: (value) => {
      return <ResultTag status={value} type="sample" />;
    },
  },
  {
    title: 'Pool Run',
    dataIndex: 'pool_run_title',
  },
  {
    title: 'Action',
    dataIndex: 'action',
  },
  {
    title: 'PoolRack ID',
    dataIndex: 'poolrack_id',
  },
  {
    title: 'PoolRack Position',
    dataIndex: 'poolrack_position',
  },
  {
    title: 'Rack ID',
    dataIndex: 'rack_id',
  },
  {
    title: 'Completed',
    dataIndex: 'completed',
    align: 'center',
    width: 100,
    render: (value) => {
      return (
        <Checkbox
          checked={value}
          // TODO: uncomment when API endpoint will be ready
          // disabled={value}
          disabled
        />
      );
    },
  },
  {
    title: 'Completed By',
    dataIndex: 'completed_by',
  },
];

export default columns;
