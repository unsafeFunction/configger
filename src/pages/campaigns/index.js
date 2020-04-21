import React from 'react';

import { Table, Tag, Button } from 'antd';

import styles from './styles.module.scss';

const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
    },
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Delivered',
      dataIndex: 'delivered',
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
    },
    {
      title: 'Edited',
      dataIndex: 'edited',
    },
  ];

  const data = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 46; i++) {
  data.push({
    key: 'SMS 20SF | FEMALE | 35-40',
    name: `Campaign SMS offer 2${i}`,
    status: <Tag color="volcano">status</Tag>,
    delivered: `${i} %`,
    clicks: `${i} %`,
    edited: `${i} minutes ago`
  });
}

const Campaigns = () => {

    return <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 1200 }}
      bordered
      showHeader
      title={()=>{return (
        <div className={styles.tableHeader}>
          <span>Campaigns</span>
          <Button type="primary">Create Campaign</Button>
        </div>
      )}}
      align="center"
    />

}

export default Campaigns;