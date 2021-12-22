import React, { Component } from "react";

import classnames from "classnames";

state = {
  loading: true
}

class Dashboard extends Component {
  render() {
    const dashboardClasses = classnames("dashboard");

    return <main className={dashboardClasses} />;
  }
}

export default Dashboard;
