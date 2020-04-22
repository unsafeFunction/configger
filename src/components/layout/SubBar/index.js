import React from 'react'
import { Link } from 'react-router-dom'

import styles from './style.module.scss'

const SubBar = ({location}) => {
  const pathArray = location.pathname.slice(1).split('/')

  return (
    <div className={styles.subbar}>
      <ul className={`${styles.breadcrumbs} mr-4`}>
        <li className={styles.breadcrumb}>
          {
             pathArray.map(path=>{
                return  <Link to={`/${path}`} className={styles.breadcrumbLink}>{path}</Link>
             })
           }
        </li>
      </ul>
    </div>
  )
}

export default SubBar
