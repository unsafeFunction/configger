import React from 'react'

class General2v2 extends React.Component {
  render() {
    return (
      <div className="d-flex flex-wrap align-items-center">
        <div className="mr-auto">
          <p className="text-uppercase text-dark font-weight-bold mb-1">Failed</p>
          <p className="text-gray-5 mb-0">Not delivered messages</p>
        </div>
        <p className="text-danger font-weight-bold font-size-24 mb-0">300</p>
      </div>
    )
  }
}

export default General2v2
