import React from 'react';
import { Card } from 'antd';
import styled from './styles.module.scss';

type Props = {
  onClick: () => void;
};

const AddEnvButton = ({ onClick }: Props): JSX.Element => {
  return (
    <Card onClick={onClick} className={styled.addButton}>
      +
    </Card>
  );
};

export default AddEnvButton;
