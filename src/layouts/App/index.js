import React from 'react'
import { Layout } from 'antd'
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import classNames from 'classnames'
import TopBar from 'components/layout/TopBar'
import MenuLeft from 'components/layout/MenuLeft'
import SubBar from 'components/layout/SubBar'
import MenuTop from 'components/layout/MenuTop'

const AppLayout = (props) => {
  const settings = useSelector(state => state.settings);

  const  {
    menuLayoutType,
    isContentNoMaxWidth,
    isAppMaxWidth,
    isGrayBackground,
    isSquaredBorders,
    isCardShadow,
    isBorderless,
    isTopbarFixed,
    isGrayTopbar,
  } = settings;
  const { children } = props

  const location = useLocation();

  return (
    <Layout
      className={classNames({
        air__layout__contentNoMaxWidth: isContentNoMaxWidth,
        air__layout__appMaxWidth: isAppMaxWidth,
        air__layout__grayBackground: isGrayBackground,
        air__layout__squaredBorders: isSquaredBorders,
        air__layout__cardsShadow: isCardShadow,
        air__layout__borderless: isBorderless,
      })}
    >
      {menuLayoutType === 'left' && <MenuLeft />}
      {menuLayoutType === 'top' && <MenuTop />}
      <Layout>
        <Layout.Header
          className={classNames('air__layout__header', {
            air__layout__fixedHeader: isTopbarFixed,
            air__layout__headerGray: isGrayTopbar,
          })}
        >
          <TopBar />
          <SubBar location={location} />
        </Layout.Header>
        <Layout.Content style={{ height: '100%', position: 'relative' }}>
          <div className="air__utils__content">{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
