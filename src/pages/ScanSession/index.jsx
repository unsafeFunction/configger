import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import companyActions from 'redux/companies/actions';
import actions from 'redux/scanSessions/actions';
import { constants } from 'utils/constants';
import rules from 'utils/rules';
import layout from './utils';

const ScanSession = () => {
  const { Item } = Form;
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
      label: item.id,
    };
  });

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_SESSION_ID_REQUEST,
      });

      dispatch({
        type: companyActions.FETCH_COMPANIES_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
        },
      });

      if (!activeSessionId) {
        form.setFieldsValue({
          companyName: company.name,
          companyShort: company.name_short,
          intakeLog: '',
        });
      }
    }, [form, activeSessionId, company]);
  };

  useFetching();

  const startSession = useCallback(
    (values) => {
      const { companyId, intakeLog } = values;
      dispatch({
        type: actions.CREATE_SESSION_REQUEST,
        payload: { companyId, intakeLog },
      });
    },
    [dispatch],
  );

  const handleCompanyBlur = useCallback(
    (e) => {
      const { value } = e.target;

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
        <Input placeholder="Company ID" onBlur={handleCompanyBlur} />
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
