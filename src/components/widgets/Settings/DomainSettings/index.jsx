import React from 'react'
import { Row, Col, Typography, Table, Tag, Button } from 'antd'

import styles from './styles.module.scss'

const columns = [
  {
    title: 'Domain Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'DNS Target',
    dataIndex: 'dns',
    key: 'dns',
  },
  {
    title: 'ACM Status',
    dataIndex: 'status',
    key: 'status',
  },
]

const data = [
  {
    name: 'hello.yellow.systems',
    dns: 'modern-goldenrod-i4qwekqlejq',
    status: <Tag color="success">Success</Tag>,
  },
]

const DomainSettings = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Typography.Title level={4}>Custom Domains</Typography.Title>
          <Typography.Paragraph>
            You can add custom domains to any campaign tracking link shortener.
          </Typography.Paragraph>
        </Col>
        <Col span={16} className={styles.domains}>
          <Button ghost className={styles.domainButton} type="primary">
            Create Domain
          </Button>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Col>
      </Row>
    </>
  )
}

export default DomainSettings
