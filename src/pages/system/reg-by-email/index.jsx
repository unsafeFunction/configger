import React from 'react';
import { Helmet } from 'react-helmet';
import RegByEmail from 'components/system/Auth/RegByEmail';

class SystemRegByEmail extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Registration by email" />
        <RegByEmail />
      </div>
    );
  }
}

export default SystemRegByEmail;
