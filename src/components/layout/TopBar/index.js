import React from 'react'
import Search from './Search'
import UserMenu from './UserMenu'
import style from './style.module.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className={style.topbar}>
        <Search />
        <div className="">
          <UserMenu />
        </div>
      </div>
    )
  }
}

export default TopBar
