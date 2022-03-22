/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable camelcase */
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { List, Popover, Typography } from 'antd';
import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import styles from './styles.module.scss';

type ViolationProps = {
  violation: string;
};

type RecordProps = {
  record: {
    shipment: string;
    shipping_condition: string;
    shipping_violations: ViolationProps[];
    packing_slip_condition: string;
    total_packing_slips: number;
    sample_condition: string;
    comments: null | string;
    tracking_numbers: null | string[];
  };
};

const ShipmentDetails = ({ record }: RecordProps) => {
  const {
    shipment,
    shipping_condition,
    shipping_violations,
    packing_slip_condition,
    total_packing_slips,
    sample_condition,
    comments,
    tracking_numbers,
  } = record;

  const { isMobile } = useWindowSize();

  const getIcon = (array: string[]) => {
    if (array.includes('Unsatisfactory') || array.includes('Unacceptable')) {
      return <ExclamationCircleOutlined className={styles.warning} />;
    }
    if (array.includes('Other')) {
      return <InfoCircleOutlined className={styles.info} />;
    }
    return <CheckCircleOutlined className={styles.success} />;
  };

  const data = [
    {
      avatar: getIcon([shipping_condition]),
      title: (
        <Typography.Text>
          {`Shipping condition `}
          <span className={styles.condition}>{shipping_condition}</span>
        </Typography.Text>
      ),
      description: shipping_violations
        ?.map((item) => item.violation)
        .join(' / '),
    },
    {
      avatar: getIcon([packing_slip_condition]),
      title: (
        <Typography.Text>
          {`Packing slip condition `}
          <span className={styles.condition}>{packing_slip_condition}</span>
        </Typography.Text>
      ),
      description: `Total packing slips: ${total_packing_slips}`,
    },
    {
      avatar: getIcon([sample_condition]),
      title: (
        <Typography.Text>
          {`Samples condition `}
          {sample_condition !== 'Other' && (
            <span className={styles.condition}>{sample_condition}</span>
          )}
        </Typography.Text>
      ),
      description: comments,
    },
    {
      avatar: <CheckCircleOutlined className={styles.trackingNumber} />,
      title: 'Tracking number',
      description: tracking_numbers?.join(' / ') ?? 'Not added',
    },
  ];

  return (
    <Popover
      content={
        <List
          size="small"
          header={<div>Shipment details</div>}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      }
      placement={isMobile ? 'top' : 'left'}
      trigger="click"
      overlayClassName={styles.popover}
    >
      <Typography.Text className={styles.shippingBy}>
        {getIcon([
          shipping_condition,
          packing_slip_condition,
          sample_condition,
        ])}
        {` ${shipment}`}
      </Typography.Text>
    </Popover>
  );
};

export default ShipmentDetails;
