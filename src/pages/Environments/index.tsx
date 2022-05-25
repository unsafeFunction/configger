import React, { useEffect } from 'react';
import Environment from 'components/widgets/Enviroments/Enviroment';
import AddEnvButton from 'components/widgets/Enviroments/AddEnvButton';
import { useDispatch } from 'react-redux';
import modalActions from 'redux/modal/actions';
import actions from 'redux/enviroments/actions';
import { Input, Select } from 'antd';
import styles from './styles.module.scss';

const Environments = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: actions.FETCH_ENVIROMENT_REQUEST,
    });
  }, [dispatch]);

  const createEnviroment = () => {
    dispatch({
      type: actions.CREATE_ENVIROMENT_REQUEST,
      payload: {
        name: 'New enviroment',
      },
    });
  };

  const onCreateEnviroment = () => {
    dispatch({
      type: modalActions.SHOW_MODAL,
      modalType: 'COMPLIANCE_MODAL',
      modalProps: {
        title: 'Create new enviroment',
        onOk: createEnviroment,
        message: () => (
          <div>
            <p className="mb-2">Title</p>
            <Input className="mb-3" placeholder="Enviroment title" />
            <p className="mb-2">Attached Users</p>
            <Select
              className="w-100"
              mode="multiple"
              allowClear
              placeholder="Select users"
            />
          </div>
        ),
      },
    });
  };

  return (
    <>
      <h2>Environments</h2>
      <div className={styles.enviroments}>
        <Environment enviroment={{}} />
        <Environment enviroment={{}} />
        <Environment enviroment={{}} />
        <Environment enviroment={{}} />
        <AddEnvButton onClick={onCreateEnviroment} />
      </div>
    </>
  );
};

export default Environments;
