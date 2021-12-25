import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading.js";
import Panel from "./Panel.js";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];


class Dashboard extends Component {

  state = {
  // loading: true
  loading: false,
  focused: null
  }

  /*
  selectPanel must be an arrow function because of how they handle this context. Arrow functions are designed to alter this behaviour in a specific way. The binding is not dynamic; it is is based on where the function is declared.
  */
  // Would be an Arrow Function
  // ex. selectPanel = id => {
    // this.setState({
    //   focused: id
    //  });

  // Instance Method
  selectPanel(id) {
    //By adding prevSate it allow you to click on a panel to enlarge and then click again to go back to show all panels
    this.setState(prevState => ({
     focused: prevState.focused !== null ? null : id
    }));
  }

  
  render() {

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    if (this.state.loading) {
      return <Loading />
    }

    const panels = data
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
    )
    .map(panel => (
      <Panel 
        key={panel.id}
        // id={panel.id}
        label={panel.label}
        value={panel.value}
        // We have to use this.selectPanel because we are passing a reference to the instance method as a prop.
        onSelect={event => this.selectPanel(panel.id)}
      />
    ));
    console.log("panels", panels);

    // return <main className={dashboardClasses} />;
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
