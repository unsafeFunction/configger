import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import Switch from 'react-router-transition-switch';
import styles from './style.module.scss';

const SubBar = ({ location }) => {
  const pathArray = location.pathname.slice(1).split('/');
  const company = useSelector((state) => state.companies.singleCompany);

  return (
    <div className={styles.subbar}>
      <ul className={`${styles.breadcrumbs} mr-4`}>
        {pathArray[0] === 'runs' ||
        pathArray[0] === 'users' ||
        pathArray[0] === 'session' ||
        pathArray[0] === 'pool-scans' ||
        pathArray[0] === 'rack-scans' ||
        pathArray[0] === 'analysis-runs' ? (
          <li className={styles.breadcrumb}>
            <Link to={`/${pathArray[0]}`} className={styles.breadcrumbLink}>
              {pathArray[0].replace('-', ' ')}
            </Link>
          </li>
        ) : (
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
                    {path.replaceAll('-', ' ')}
                  </Link>
                  {index + 1 !== pathArray.length && pathArray.length > 1 && (
                    <span className={styles.breadcrumbLink__dash}>-</span>
                  )}
                </Fragment>
              );
            })}
          </li>
        )}
      </ul>
    </div>
  );
};

SubBar.propTypes = {
  location: PropTypes.shape({}).isRequired,
};

export default SubBar;
