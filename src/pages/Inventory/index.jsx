import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Table } from 'antd';
import classNames from 'classnames';
import TableFooter from 'components/layout/TableFooterLoader';
import { ControlTubeModal } from 'components/widgets/Inventory';
import useWindowSize from 'hooks/useWindowSize';
import debounce from 'lodash.debounce';
import moment from 'moment-timezone';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/inventory/actions';
import modalActions from 'redux/modal/actions';
import { constants } from 'utils/constants';
import useCustomFilters from 'utils/useCustomFilters';
import styles from './styles.module.scss';

const Inventory = () => {
  const { isMobile, isTablet } = useWindowSize();

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const initialFiltersState = {
    search: '',
  };

  const [filtersState, filtersDispatch] = useCustomFilters(initialFiltersState);

  const inventory = useSelector((state) => state.inventory);

  const handleResetForm = useCallback(() => {
    form.resetFields();
  }, [form]);

  const createControlTube = useCallback(async () => {
    const fieldValues = await form.validateFields();
    dispatch({
      type: actions.CREATE_INVENTORY_ITEM_REQUEST,
      payload: {
        item: fieldValues,
        resetForm: handleResetForm,
      },
    });
  }, [form, dispatch, handleResetForm]);

  const columns = [
    {
      title: 'Tube ID',
      dataIndex: 'tube_id',
      render: (value) => {
        return value ?? '-';
      },
    },
    {
      title: 'Control',
      dataIndex: 'control',
      render: (value) => {
        return (
          constants.controlTypes.find((type) => type.value === value)?.label ??
          '-'
        );
      },
    },
    {
      title: 'Created On',
      dataIndex: 'created',
      render: (value) =>
        value ? moment(value).format(constants.dateTimeFormat) : '-',
    },
    {
      title: 'User',
      dataIndex: 'user',
      render: (value) => value ?? '-',
    },
  ];

  const useFetching = () => {
    useEffect(() => {
      dispatch({
        type: actions.FETCH_INVENTORY_REQUEST,
        payload: {
          limit: constants.companies.itemsLoadingCount,
          search: filtersState.search,
        },
      });
    }, []);
  };

  useFetching();

  const onModalToggle = useCallback(() => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Add Control Tube',
        onOk: createControlTube,
        cancelButtonProps: { className: styles.modalButton },
        okButtonProps: {
          className: styles.modalButton,
        },
        bodyStyle: {
          maxHeight: '70vh',
          overflow: 'scroll',
        },
        okText: 'Create',
        message: () => <ControlTubeModal form={form} />,
        onCancel: handleResetForm,
      },
    });
  }, [dispatch, handleResetForm, form, createControlTube]);

  const loadMore = useCallback(() => {
    dispatch({
      type: actions.FETCH_INVENTORY_REQUEST,
      payload: {
        limit: constants.inventory.itemsLoadingCount,
        offset: inventory.offset,
        search: filtersState.search,
      },
    });
  }, [dispatch, inventory]);

  const sendQuery = useCallback(
    (query) => {
      dispatch({
        type: actions.FETCH_INVENTORY_REQUEST,
        payload: {
          limit: constants.inventory.itemsLoadingCount,
          search: query,
        },
      });
    },
    [dispatch],
  );

  const delayedQuery = useCallback(
    debounce((q) => sendQuery(q), 500),
    [],
  );

  const onChangeSearch = useCallback(
    (event) => {
      const { target } = event;

      filtersDispatch({
        type: 'setValue',
        payload: {
          name: 'search',
          value: target.value,
        },
      });

      return delayedQuery(target.value);
    },
    [delayedQuery],
  );

  return (
    <div>
      <Table
        dataSource={inventory?.items}
        columns={columns}
        scroll={{ x: 800 }}
        loading={inventory?.isLoading}
        align="center"
        pagination={false}
        rowKey={(record) => record.created}
        title={() => {
          return isTablet ? (
            <div className={styles.mobileTableHeaderWrapper}>
              <h4>Inventory</h4>
              <Button
                onClick={onModalToggle}
                size="middle"
                type="primary"
                className={!isTablet && 'ml-3'}
              >
                Add Control Tube
              </Button>
              <Input
                size="middle"
                prefix={<SearchOutlined />}
                className={styles.search}
                placeholder="Search..."
                value={filtersState.search}
                onChange={onChangeSearch}
              />
            </div>
          ) : (
            <>
              <h4>Inventory</h4>
              <div
                className={classNames(styles.tableActionsWrapper, {
                  [styles.tabletActionsWrapper]: isTablet,
                })}
              >
                <Input
                  size="middle"
                  prefix={<SearchOutlined />}
                  className={styles.search}
                  placeholder="Search..."
                  value={filtersState.search}
                  onChange={onChangeSearch}
                />
                <Button
                  onClick={onModalToggle}
                  size="large"
                  type="primary"
                  className={!isMobile && 'ml-3'}
                >
                  Add Control Tube
                </Button>
              </div>
            </>
          );
        }}
      />
      <TableFooter
        loading={inventory?.isLoading}
        disabled={inventory?.items?.length >= inventory?.total}
        loadMore={loadMore}
      />
    </div>
  );
};

export default Inventory;
