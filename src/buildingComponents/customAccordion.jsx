import React from "react";

export default class CustomAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  render() {
    const { opened } = this.state;
    const { label, title, children } = this.props;
    return (
      <div className="custom-accordion">
        <div
          className="title"
          onClick={() => this.setState({ opened: !opened })}
        >
          {label || title}
        </div>
        {opened && children}
      </div>
    );
  }
}
