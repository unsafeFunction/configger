import React from 'react'
import { Menu, Dropdown } from 'antd'
import styles from './style.module.scss'

class LanguageSwitcher extends React.Component {
  render() {
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <span className="text-uppercase font-size-12 mr-2">EN</span>
          English
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <div className={styles.dropdown}>
          <span>EN</span>
        </div>
      </Dropdown>
    )
  }
}

export default LanguageSwitcher
