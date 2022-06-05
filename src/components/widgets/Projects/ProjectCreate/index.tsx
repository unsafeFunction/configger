import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'redux/projects/actions';
import { Modal } from 'antd';
import ProjectModal from '../ProjectModal';

type Props = {
  isModalOpen: boolean;
  onOpenModal: () => void;
  envId: string;
};

const ProjectCreate = ({
  isModalOpen,
  onOpenModal,
  envId,
}: Props): JSX.Element => {
  const [name, setName] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target;

    setName(value);
  };

  const createProject = () => {
    dispatch({
      type: actions.CREATE_PROJECT_REQUEST,
      payload: {
        name,
        envId,
      },
    });

    onOpenModal();
  };

  return (
    <Modal
      title="Create new enviroment"
      visible={isModalOpen}
      onOk={createProject}
      onCancel={onOpenModal}
    >
      <ProjectModal onChange={onChange} />
    </Modal>
  );
};

export default ProjectCreate;
