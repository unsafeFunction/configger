import React from 'react';
import classNames from 'classnames';
import styles from './style.module.scss';

type AppProps = {
  spinning: boolean;
  fullScreen: boolean;
};

const Loader = ({ spinning = true, fullScreen }: AppProps) => (
  <div
    className={classNames(styles?.loader, {
      [styles.hidden]: !spinning,
      [styles.fullScreen]: fullScreen,
    })}
  />
);

export default Loader;
