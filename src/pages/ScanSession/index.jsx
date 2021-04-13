import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from 'redux/scanSessions/actions';
import rules from 'utils/rules';
import styles from './styles.module.scss';
import layout from './utils';

moment.tz.setDefault('America/New_York');

const ScanSession = () => {
  const { Item } = Form;
  const { Search } = Input;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const {
    activeSessionId,
    isLoading: isSessionLoading,
    intakeLogs,
    companyInfoLoading,
  } = useSelector((state) => state.scanSessions.singleSession);

  const company = useSelector((state) => state.companies.singleCompany);

  const preparedData = intakeLogs.map((item) => {
    return {
      value: item.id,
      label: `${item.log_id} (${moment(item.created).format('lll')})`,
    };
  });

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SESSION_ID_REQUEST,
      });

      if (!activeSessionId) {
        form.setFieldsValue({
          companyName: company.name,
          companyShort: company.name_short,
          intakeLog: '',
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, activeSessionId, company]);
  };

  useFetching();

  const startSession = useCallback(
    (values) => {
      const { intakeLog } = values;
      dispatch({
        type: actions.CREATE_SESSION_REQUEST,
        payload: { intakeLog },
      });
    },
    [dispatch],
  );

  const handleCompanySearch = useCallback(
    (value) => {
      if (value) {
        dispatch({
          type: actions.FETCH_COMPANY_INFO_REQUEST,
          payload: { id: value },
        });
      }
    },
    [dispatch],
  );

  if (!isSessionLoading && activeSessionId) {
    return <Redirect to={`/session/${activeSessionId}`} />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      labelCol={layout}
      wrapperCol={layout}
      onFinish={startSession}
    >
      <Item label="Company ID" name="companyId" rules={[rules.required]}>
        <Search
          placeholder="Company ID"
          onSearch={handleCompanySearch}
          className={styles.inputSearch}
        />
      </Item>

      <Item label="Company name" name="companyName" rules={[rules.required]}>
        <Input
          disabled
          placeholder="Company name"
          suffix={company.isLoadingCompany && <LoadingOutlined />}
        />
      </Item>

      <Item label="Company short" name="companyShort">
        <Input
          disabled
          placeholder="Company short"
          suffix={company.isLoadingCompany && <LoadingOutlined />}
        />
      </Item>

      <Item
        label="Intake Receipt Log"
        name="intakeLog"
        rules={[rules.required]}
      >
        <Select
          placeholder="Intake Receipt Log"
          loading={companyInfoLoading}
          showArrow
          showSearch
          options={preparedData}
          optionFilterProp="label"
          allowClear
        />
      </Item>

      <Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={isSessionLoading}
        >
          Start session
        </Button>
      </Item>
    </Form>
  );
};

export default ScanSession;
