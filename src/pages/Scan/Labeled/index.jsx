import React from 'react';
import styles from './styles.module.scss';

const LabeledInput = ({title, node, inputStyles}) => {
  return (
    <div className={styles.labeledWrapper}>
      <p className={styles.title}>{title}</p>
      {node}
    </div>
  )
}

export default LabeledInput;
