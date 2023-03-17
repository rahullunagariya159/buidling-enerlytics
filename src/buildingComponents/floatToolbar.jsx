import React from "react";
import { toast } from "react-toastify";

export default class FloatToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unit: "In",
      locked: false,
      showDimension: true,
      snap: true,
      xRay: false,
    };
  }

  getButtons = () => {
    const { info } = this.props;

    let buttons = [
      {
        font: "far fa-trash-alt",
        tooltip: "Delete",
        callback: () => {
          if (!info) {
            toast.error("Product not selected");
            return;
          }
          this.props.onDeleteActiveProduct();
        },
      },
    ];
    return buttons;
  };

  render() {
    const buttons = this.getButtons();
    return (
      <div className="float-toolbar">
        {buttons.map((button, index) => {
          if (!button) return <div key={index} className="hr"></div>;
          return (
            <div
              key={index}
              className={`float-toolbar-button ${
                button.toggled ? "toggled" : ""
              }`}
              data-tip={button.tooltip}
              onClick={() => {
                typeof button.callback === "function" && button.callback();
              }}
            >
              <span className={button.font} style={button.fontStyle}>
                {button.label}
              </span>
            </div>
          );
        })}
        
      </div>
    );
  }
}
