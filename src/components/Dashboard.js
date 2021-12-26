import React, { Component } from "react";

import classnames from "classnames";

import Loading from "./Loading.js";
import Panel from "./Panel.js";
import axios from "axios";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";
import { setInterview } from "helpers/reducers";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];


class Dashboard extends Component {

  state = {
    loading: true,
    // loading: false,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  }

  /* 
  With these two changes, we can check the browser. Clicking on a panel will enlarge it, and if we reload the browser we will see that it loads the initial state from the localStorage.
  */
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);

      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };

    if (focused) {
      this.setState({ focused });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

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
          value={panel.getValue(this.state)}
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
