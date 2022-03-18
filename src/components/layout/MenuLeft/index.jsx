import { Layout } from 'antd';
import classNames from 'classnames';
import find from 'lodash.find';
import get from 'lodash.get';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import labConfig from 'utils/labConfig';
import style from './style.module.scss';

const { Sider } = Layout;
const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  rolePermissions: menu.rolePermissions,
  settings,
  flyoutActive:
    (settings.menuType === 'flyout' ||
      settings.menuType === 'compact' ||
      settings.isMenuCollapsed) &&
    !settings.isMobileView,
  profile: user.profile,
  role: user.role,
});

@withRouter
@connect(mapStateToProps)
class MenuLeft extends React.Component {
  state = {
    activeSubmenu: '',
    activeItem: '',
    renderedFlyoutItems: {},
  };

  flyoutTimers = {};

  currentLocation = '';

  componentDidMount() {
    this.setActiveItems(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { pathname } = newProps.location;
    if (this.currentLocation.split('/')[1] !== pathname.split('/')[1]) {
      this.setActiveItems(newProps);
      this.currentLocation = pathname;
    }
  }

  toggleSettings = () => {
    const { dispatch, settings } = this.props;
    const { isSidebarOpen } = settings;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSidebarOpen',
        value: !isSidebarOpen,
      },
    });
  };

  toggleMenu = () => {
    const { dispatch, settings } = this.props;
    const { isMenuCollapsed } = settings;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    });
  };

  toggleMobileMenu = () => {
    const { dispatch, settings } = this.props;
    const { isMobileMenuOpen } = settings;
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    });
  };

  handleSubmenuClick = (key) => {
    const { activeSubmenu, activeItem } = this.state;
    const { flyoutActive, menuData, history } = this.props;
    if (flyoutActive) {
      return;
    }
    const activeSubmenuItem = menuData.find((menuItem) => menuItem.key === key);
    const firstChild = activeSubmenuItem?.children?.[0];
    this.setState({
      activeSubmenu: key,
      activeItem: activeSubmenu !== key ? firstChild.key : activeItem,
    });
    if (activeSubmenu !== key) {
      history.push(firstChild.url);
    }
  };

  handleFlyoutOver = (event, key, items) => {
    const { flyoutActive } = this.props;
    if (flyoutActive) {
      clearInterval(this.flyoutTimers[key]);
      const item = event.currentTarget;
      const itemDimensions = item.getBoundingClientRect();
      const element = this.renderFlyoutMenu(items, key, itemDimensions);
      this.setState((state) => ({
        renderedFlyoutItems: {
          ...state.renderedFlyoutItems,
          [key]: element,
        },
      }));
    }
  };

  handleFlyoutOut = (key) => {
    const { flyoutActive } = this.props;
    if (flyoutActive) {
      this.flyoutTimers[key] = setTimeout(() => {
        this.setState((state) => {
          delete state.renderedFlyoutItems[key];
          return {
            renderedFlyoutItems: {
              ...state.renderedFlyoutItems,
            },
          };
        });
      }, 100);
    }
  };

  handleFlyoutContainerOver = (key) => {
    clearInterval(this.flyoutTimers[key]);
  };

  renderFlyoutMenu = (items, key, itemDimensions) => {
    const { settings } = this.props;
    const { activeItem } = this.state;
    const left = `${itemDimensions.left + itemDimensions.width - 10}px`;
    const top = `${itemDimensions.top}px`;

    return (
      <div
        style={{ left, top }}
        className={classNames(style.air__menuFlyout, {
          [style.air__menuFlyoutLeft]: settings.menuLayoutType === 'left',
          [style.air__menuFlyout__black]: settings.flyoutMenuColor === 'dark',
          [style.air__menuFlyout__white]: settings.flyoutMenuColor === 'white',
          [style.air__menuFlyout__gray]: settings.flyoutMenuColor === 'gray',
        })}
        key={key}
      >
        <ul
          className={style.air__menuLeft__list}
          onMouseEnter={() => this.handleFlyoutContainerOver(key)}
          onMouseLeave={() => this.handleFlyoutOut(key)}
        >
          {items.map((item) => {
            return (
              <li
                className={classNames(style.air__menuLeft__item, {
                  [style.air__menuLeft__item__active]: activeItem === item.key,
                })}
                key={item.key}
              >
                <Link to={item.url} className={style.air__menuLeft__link}>
                  {item.icon && (
                    <i
                      className={`${item.icon} ${style.air__menuLeft__icon}`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  setActiveItems = (props) => {
    const { menuData = [] } = props;
    if (!menuData.length) {
      return;
    }
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }
        return flattenedItems;
      }, []);
    const activeItem = find(flattenItems(menuData, 'children'), (obj) =>
      obj?.url?.includes(`/${props.location.pathname.split('/')[1]}`),
    );

    const activeSubmenu = menuData.reduce((key, parent) => {
      if (Array.isArray(parent.children)) {
        parent.children.map((child) => {
          if (child?.key === activeItem?.key) {
            key = parent;
          }
          return parent;
        });
      }
      return key;
    }, '');
    this.setState({
      activeItem: get(activeItem, 'key', null),
      activeSubmenu: activeSubmenu.key,
    });
  };

  generateMenuItems = () => {
    const { menuData = [], role, rolePermissions } = this.props;
    const { activeSubmenu, activeItem } = this.state;

    const menuItem = (item) => {
      const { key, title, icon, url } = item;
      if (item.category) {
        return (
          <li className={style.air__menuLeft__category} key={Math.random()}>
            <span>{title}</span>
          </li>
        );
      }
      return (
        <li
          className={classNames(style.air__menuLeft__item, {
            [style.air__menuLeft__item__active]: activeItem === key,
            [style.firstHelpItem]: item.key === 'contactUs',
          })}
          key={key}
        >
          {item.url && (
            <Link to={url} className={style.air__menuLeft__link}>
              {item.dotColor && (
                <div
                  style={{
                    borderColor: item.dotColor,
                  }}
                  className={style.air_menuLeft_dot}
                />
              )}
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
              {item.count && (
                <span className="badge text-white bg-blue-light float-right mt-1 px-2">
                  {item.count}
                </span>
              )}
            </Link>
          )}
          {!item.url && item.key === 'helpCenter' && (
            <a
              href="https://mirimus.freshdesk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={style.air__menuLeft__link}
            >
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
            </a>
          )}
          {!item.url && item.key === 'contactUs' && (
            <a
              href={`mailto:${
                labConfig[process.env.REACT_APP_LAB_ID].contacts.email
              }`}
              className={style.air__menuLeft__link}
            >
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
            </a>
          )}
          {item.key === 'version' && (
            // TODO: add link to changelog
            <span className={style.air__menuLeft__link}>
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
            </span>
          )}
        </li>
      );
    };

    const submenuItem = (item) => {
      return (
        <li
          className={classNames(
            style.air__menuLeft__item,
            style.air__menuLeft__submenu,
            {
              [style.air__menuLeft__submenu__active]:
                activeSubmenu === item.key,
            },
          )}
          key={item.key}
        >
          <a
            href="javascript: void(0);"
            className={style.air__menuLeft__link}
            onClick={() => this.handleSubmenuClick(item.key)}
            onMouseEnter={(event) =>
              this.handleFlyoutOver(event, item.key, item.children)
            }
            onFocus={(event) =>
              this.handleFlyoutOver(event, item.key, item.children)
            }
            onMouseLeave={() => this.handleFlyoutOut(item.key)}
            onBlur={() => this.handleFlyoutOut(item.key)}
          >
            <i className={`${item.icon} ${style.air__menuLeft__icon}`} />
            <span>{item.title}</span>
            {item.count && (
              <span className="badge text-white bg-blue-light float-right mt-1 px-2">
                {item.count}
              </span>
            )}
          </a>
          <ul className={style.air__menuLeft__list}>
            {item.children.map((sub) => {
              if (sub.children) {
                return submenuItem(sub);
              }
              return menuItem(sub);
            })}
          </ul>
        </li>
      );
    };

    return menuData.map((item) => {
      if (!role || !rolePermissions) {
        return;
      }
      if (item.url && !rolePermissions[role].permitted.includes(item.url)) {
        return;
      }
      if (item.children) {
        return submenuItem(item);
      }
      return menuItem(item);
    });
  };

  getInitials(firstName, lastName) {
    if (firstName && lastName) {
      return `${firstName.charAt(0).toUpperCase()}${lastName
        .charAt(0)
        .toUpperCase()}`;
    }

    return '';
  }

  render() {
    const { settings } = this.props;
    const { renderedFlyoutItems } = this.state;
    const items = this.generateMenuItems();
    return (
      <Sider width="auto">
        <TransitionGroup>
          {Object.keys(renderedFlyoutItems).map((item) => {
            return (
              <CSSTransition
                key={item}
                timeout={0}
                classNames="air__menuFlyout__animation"
              >
                {renderedFlyoutItems[item]}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        <div
          className={classNames(style.air__menuLeft, {
            [style.air__menuLeft__mobileToggled]: settings.isMobileMenuOpen,
            [style.air__menuLeft__toggled]: settings.isMenuCollapsed,
            [style.air__menuLeft__unfixed]: settings.isMenuUnfixed,
            [style.air__menuLeft__shadow]: settings.isMenuShadow,
            [style.air__menuLeft__flyout]: settings.menuType === 'flyout',
            [style.air__menuLeft__compact]: settings.menuType === 'compact',
            [style.air__menuLeft__blue]: settings.menuColor === 'blue',
            [style.air__menuLeft__white]: settings.menuColor === 'white',
            [style.air__menuLeft__gray]: settings.menuColor === 'gray',
            [style.air__menuFlyout__black]:
              settings.flyoutMenuColor === 'dark' &&
              settings.menuType !== 'default',
            [style.air__menuFlyout__white]:
              settings.flyoutMenuColor === 'white' &&
              settings.menuType !== 'default',
            [style.air__menuFlyout__gray]:
              settings.flyoutMenuColor === 'gray' &&
              settings.menuType !== 'default',
          })}
        >
          <div className={style.air__menuLeft__outer}>
            <div
              role="presentation"
              className={style.air__menuLeft__mobileToggleButton}
              onClick={this.toggleMobileMenu}
            >
              <span />
            </div>
            <div
              role="presentation"
              className={style.air__menuLeft__toggleButton}
              onClick={this.toggleMenu}
            >
              <span />
              <span />
            </div>
            <div role="presentation" className={style.air__menuLeft__logo}>
              <img
                src={`/resources/images/${process.env.REACT_APP_LAB_ID}.svg`}
                alt="Lab logo"
                className={style.logo}
              />
              <div className={style.air__menuLeft__logo__name}>
                {labConfig[process.env.REACT_APP_LAB_ID].name}
              </div>
              <div className={style.air__menuLeft__logo__descr}>
                Clinical Labs
              </div>
            </div>
            <Scrollbars
              autoHide
              renderThumbVertical={({ ...props }) => (
                <div
                  {...props}
                  style={{
                    width: '5px',
                    borderRadius: 'inherit',
                    backgroundColor: 'rgba(195, 190, 220, 0.4)',
                    left: '1px',
                  }}
                />
              )}
            >
              <div
                id="menu-left-container"
                className={style.air__menuLeft__container}
              >
                <ul
                  className={classNames(
                    style.air__menuLeft__list,
                    style.air__menuLeft__mainList,
                  )}
                >
                  {items}
                </ul>
              </div>
            </Scrollbars>
          </div>
        </div>
        <div
          role="presentation"
          className={style.air__menuLeft__backdrop}
          onClick={this.toggleMobileMenu}
        />
      </Sider>
    );
  }
}

export default MenuLeft;
