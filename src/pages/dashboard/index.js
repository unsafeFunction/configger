import React from 'react'
import { Helmet } from 'react-helmet'
import General2 from 'components/widgets/General/2'
import General2v1 from 'components/widgets/General/2v1'
import General2v2 from 'components/widgets/General/2v2'

class DashboardStatistics extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Dashboard: Statistics" />
        <div className="air__utils__heading">
          <h5>Dashboard</h5>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-12">
            <div className="card">
              <div className="card-body">
                <General2 />
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-12">
            <div className="card">
              <div className="card-body">
                <General2v1 />
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-12">
            <div className="card">
              <div className="card-body">
                <General2v2 />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardStatistics
