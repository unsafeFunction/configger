import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from 'react-router-transition-switch';
import { Link, Route } from 'react-router-dom';

import styles from './style.module.scss';

const SubBar = ({ location }) => {
  const pathArray = location.pathname.slice(1).split('/');
  const company = useSelector(state => state.companies.singleCompany);

  return (
    <div className={styles.subbar}>
      <ul className={`${styles.breadcrumbs} mr-4`}>
        <li className={styles.breadcrumb}>
          {pathArray.map((path, index) => {
            if (index + 1 === pathArray.length && pathArray.length > 1) {
              return (
                <span key={path} className={styles.breadcrumb__last}>
                  <Switch>
                    <Route exact path="/companies/:id">
                      {company.name}
                    </Route>
                    <Route path="*">{path}</Route>
                  </Switch>
                </span>
              );
            }
            return (
              <Fragment key={path}>
                <Link to={`/${path}`} className={styles.breadcrumbLink}>
                  {path}
                </Link>
                {index + 1 !== pathArray.length && pathArray.length > 1 && (
                  <span className={styles.breadcrumbLink__dash}>-</span>
                )}
              </Fragment>
            );
          })}
        </li>
      </ul>
    </div>
  );
};

SubBar.propTypes = {
  location: PropTypes.object.isRequired,
};

export default SubBar;
