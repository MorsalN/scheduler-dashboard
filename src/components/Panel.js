import React, {Component} from "react";

export default class Panel extends Component {
  render() {
    //  Need to make the following changes to the component to handle the new props. Remember to destructure id and onSelect since we use them now.
    const {label, value, onSelect } = this.props;

    return (
      <section
        className="dashboard__panel"
        onClick={onSelect}
      >
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}