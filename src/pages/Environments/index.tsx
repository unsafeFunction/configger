import React, { useEffect, useState } from 'react';
import Environment from 'components/widgets/Enviroments/Enviroment';
import AddEnvButton from 'components/widgets/Enviroments/AddEnvButton';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'redux/enviroments/actions';
import { Input, Select, Modal } from 'antd';
import { RootState } from 'redux/reducers';
import type { Enviroment } from 'redux/enviroments/type';
import styles from './styles.module.scss';

const Environments = (): JSX.Element => {
  const [name, setName] = useState<string | null>(null);
  const [isModalOpen, setModalState] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { items } = useSelector<RootState, any>(
    (state) => state.enviroments.all,
  );

  const onModalOpen = () => {
    setModalState(!isModalOpen);
  }

  useEffect(() => {
    dispatch({
      type: actions.FETCH_ENVIROMENT_REQUEST,
    });
  }, [dispatch]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target;

    setName(value);
  }

  const createEnviroment = () => {
    dispatch({
      type: actions.CREATE_ENVIROMENT_REQUEST,
      payload: {
        name
      },
    });

    setModalState(false)
  };

  return (
    <>
      <h2>Environments</h2>
      <div className={styles.enviroments}>
        {items.map((item: Enviroment) => {
          return <Environment key={item.id} enviroment={item} />;
        })}
        <AddEnvButton onClick={onModalOpen} />
      </div>
      <Modal
        title="Create new enviroment"
        visible={isModalOpen}
        onOk={createEnviroment}
        onCancel={onModalOpen}
      >
        <div>
          <p className="mb-2">Title</p>
          <Input onChange={onChange} className="mb-3" placeholder="Enviroment title" />
          <p className="mb-2">Attached Users</p>
          <Select
            className="w-100"
            mode="multiple"
            allowClear
            placeholder="Select users"
          />
        </div>
      </Modal>
    </>
  );
};

export default Environments;
