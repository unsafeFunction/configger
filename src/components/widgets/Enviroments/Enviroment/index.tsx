/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import {
  Drawer,
  Button,
  Input,
  Space,
  Card,
  Divider,
  Table,
  Select,
  Col,
} from 'antd';
import styles from './styles.module.scss';

type Props = {
  enviroment: any;
};

const Environment = ({ enviroment }: Props): JSX.Element => {
  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Active', dataIndex: 'is_active' },
  ];

  return (
    <Card
      title={
        <div className={styles.cardHeader}>
          <span>{enviroment.name ?? 'Your env'}</span>
          <Button className={styles.viewButton} type="primary">
            Edit
          </Button>
        </div>
      }
      className={styles.enviroment}
    >
      <ul className={styles.projectList}>
        <li role="presentation" onClick={showDrawer}>
          Project 1
        </li>
        <li>Project 2</li>
        <li>Project 3</li>
        <li>Project 4</li>
        <li>Project 5</li>
      </ul>
      <div className={styles.actions}>
        <Button className={styles.viewButton} type="primary">
          View project
        </Button>
        <Button className={styles.viewButton} type="primary">
          Add projects
        </Button>
      </div>
      <Drawer
        width={750}
        closeIcon={false}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        // @ts-ignore
        title={
          <div className={styles.drawerWrite}>
            <p className="mb-0">Project 1</p>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={onClose} type="primary">
                Submit
              </Button>
            </Space>
          </div>
        }
      >
        <Col xs="12">
          <p className="mb-2">Title</p>
          <Input className="mb-3" placeholder="Project title" />
        </Col>
        <Col xs="12">
          <p className="mb-2">Enviroments</p>
          <Select
            className="w-100"
            mode="multiple"
            allowClear
            placeholder="Select enviroments"
          />
        </Col>
        <Divider />
        <p className={styles.sectionTitle}>Spoolers</p>
        <Table columns={columns} />
      </Drawer>
    </Card>
  );
};

export default Environment;
