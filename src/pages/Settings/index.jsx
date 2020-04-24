import React from 'react'
import { Typography, Divider } from 'antd';
import { AccountSettings, DomainSettings} from 'components/widgets/Settings';
// import styles from './styles.module.scss'

const Settings = () => {
  return (
    <>
      <div className="air__utils__heading">
        <Typography.Title level={3}>
            Settings
        </Typography.Title>
      </div>
      <AccountSettings />
      <Divider />
      <DomainSettings />
    </>
  )
}

export default Settings
