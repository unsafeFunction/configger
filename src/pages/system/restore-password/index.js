import React from 'react'
import { Helmet } from 'react-helmet'
import RestorePassword from 'components/system/Auth/RestorePassword'

class SystemRestorePassword extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Restore Password" />
        <RestorePassword />
      </div>
    )
  }
}

export default SystemRestorePassword
