import React from 'react'
import Search from './Search'
import Status from './Status'
import LanguageSwitcher from './LanguageSwitcher'
import Actions from './Actions'
import UserMenu from './UserMenu'
import style from './style.module.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className={style.topbar}>
        <div className="mr-md-4 mr-auto">
          <Search />
        </div>
        <div className="ml-auto mr-3 d-none d-md-block">
          <Status />
        </div>
        <div className="mr-4 d-none d-sm-block">
          <LanguageSwitcher />
        </div>
        <div className="mr-4 d-none d-sm-block">
          <Actions />
        </div>
        <div className="">
          <UserMenu />
        </div>
      </div>
    )
  }
}

export default TopBar
