import React from 'react';
import { Row, Col, Input, Button, Form, DatePicker, InputNumber } from 'antd';
import { QrCode, Logo } from 'assets';
import styles from './styles.module.scss';

const Intake = ({ company = {} }) => {
  return (
    <Row>
      <Col className="mr-4" xs={10}>
        <Form layout="vertical">
          <Form.Item
            label="Company name"
            name="company_name"
            // initialValue={profile.first_name}
            rules={[
              {
                required: true,
                message: 'Please input company name!',
              },
            ]}
          >
            <Input size="medium" placeholder="Company name" />
          </Form.Item>
          <Form.Item
            label="Company ID"
            name="company_id"
            disabled
            // initialValue={profile.first_name}
          >
            <Input size="medium" placeholder="Company ID" />
          </Form.Item>
          <Row>
            <Col className="mr-5" xs={10}>
              <Form.Item
                type="number"
                label="Samples"
                name="sample_number"
                // initialValue={profile.first_name}
                rules={[
                  {
                    required: true,
                    message: 'Please input samples!',
                  },
                ]}
              >
                <InputNumber
                  className={styles.numericInput}
                  size="large"
                  placeholder="Samples"
                />
              </Form.Item>
            </Col>
            <Col xs={11}>
              <Form.Item
                label="Pools"
                name="pool_number"
                // initialValue={profile.first_name}
                rules={[
                  {
                    required: true,
                    message: 'Please input pool number!',
                  },
                ]}
              >
                <InputNumber
                  className={styles.numericInput}
                  size="large"
                  placeholder="Pools"
                />
              </Form.Item>
            </Col>
            <Form.Item className="mr-5" label="Ship Date" name="date">
              <DatePicker size="large" />
            </Form.Item>
          </Row>
          <Button className={styles.downloadButton} size="large" type="primary">
            Save and Download
          </Button>
        </Form>
      </Col>
      <Col xs={12}>
        <div className={styles.email}>
          <h2>Hello</h2>
          <span className={styles.titleDescription}>
            These are samples from
          </span>
          <ul className="mb-5">
            <li>
              <span>Company:</span>
              <span>{company.name || '-'}</span>
            </li>
            <li>
              <span>ID:</span>
              <span>{company.id || '-'}</span>
            </li>
            <li>
              <span>Samples:</span>
              <span>{company.sample_size || '-'}</span>
            </li>
            <li>
              <span>Pools:</span>
              <span>{company.pool_size || '-'}</span>
            </li>
            <li>
              <span>Date:</span>
              <span>{company.date || '-'}</span>
            </li>
          </ul>
          <QrCode className={styles.qrIcon} />
          <div className={styles.shipmentInfo}>
            <div className={styles.labDetails}>
              <Logo />
              <div className={styles.labAddresses}>
                <span>Ship samples to:</span>
                <span>Mirimus Clinical Labs</span>
                <span>Sample Intake</span>
                <span>710 Parkside Avenue</span>
                <span>Brooklyn, NY 11226</span>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Intake;
