import Core from "../core";
import { dimInch, dimCentiMeter, dimMeter } from "../core/dimensioning";

const zoomLevel = 80;

export default class InputWithUnit {
  dom = null;
  value = 0;

  events = {};
  constructor(placeholder) {
    this.dom = document.createElement("div");
    this.dom.setAttribute(
      "style",
      `
        display: flex;
        width: inherit;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0
      `
    );
    this.dom.insertAdjacentHTML("beforeend", `<label>${placeholder}</label>`);

    // m input container
    this.mInputContainer = document.createElement("div");
    this.inputM = document.createElement("input");
    this.inputM.setAttribute("type", "number");
    this.inputM.setAttribute("placeholder", placeholder);
    this.inputM.setAttribute("min", 0);
    this.inputM.setAttribute("step", 0.1);
    this.inputM.value = 0;
    this.inputM.style.width = "80px";

    this.inputM.addEventListener("change", (e) => {
      const value = e.target.value;
      typeof this.events["change"] === "function" &&
        this.events["change"](value);
      this.setValue(value);
    });

    this.mInputContainer.appendChild(this.inputM);
    this.mInputContainer.insertAdjacentHTML("beforeend", "<label>m</label>");
    this.dom.appendChild(this.mInputContainer);

    // cm input container
    this.cmInputContainer = document.createElement("div");
    this.inputCm = document.createElement("input");
    this.inputCm.setAttribute("type", "number");
    this.inputCm.setAttribute("placeholder", placeholder);
    this.inputCm.setAttribute("min", 0);
    this.inputCm.value = 0;
    this.inputCm.style.width = "80px";

    this.inputCm.addEventListener("change", (e) => {
      const value = e.target.value;
      typeof this.events["change"] === "function" &&
        this.events["change"](value / zoomLevel);
      this.setValue(value / zoomLevel);
    });

    this.cmInputContainer.appendChild(this.inputCm);
    this.cmInputContainer.insertAdjacentHTML("beforeend", "<label>cm</label>");
    this.dom.appendChild(this.cmInputContainer);

    // inch input container
    this.inchInputContainer = document.createElement("div");
    this.inputInch = document.createElement("input");
    this.inputInch.setAttribute("type", "number");
    this.inputInch.setAttribute("placeholder", placeholder);
    this.inputInch.setAttribute("min", 0);
    this.inputInch.value = 0;
    this.inputInch.style.width = "80px";

    this.inputInch.addEventListener("change", (e) => {
      const value = e.target.value * 2.54;
      typeof this.events["change"] === "function" &&
        this.events["change"](value / zoomLevel);
      this.setValue(value / zoomLevel);
    });
    this.inchInputContainer.appendChild(this.inputInch);
    this.inchInputContainer.insertAdjacentHTML("beforeend", '<label>"</label>');
    this.dom.appendChild(this.inchInputContainer);

    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      detail.dimUnit && this.handleUnitChanged(detail.dimUnit);
    });

    this.handleUnitChanged(Core.Configuration.getStringValue("dimUnit"));
  }

  handleUnitChanged = (unit) => {
    this.cmInputContainer.style.display = "none";
    this.inchInputContainer.style.display = "none";
    this.mInputContainer.style.display = "none";

    switch (unit) {
      case dimInch:
        this.inchInputContainer.style.display = "inherit";
        break;
      case dimMeter:
        this.mInputContainer.style.display = "inherit";
        break;
      case dimCentiMeter:
        this.cmInputContainer.style.display = "inherit";
        break;
      default:
        break;
    }
  };

  /**
   *
   * @param {Number} value measurement length in meter
   */
  setValue = (value) => {
    const cm = value * zoomLevel;
    this.inputM.value = Math.round(value * 100) / 100;
    this.inputCm.value = Math.round(10 * cm) / 10;
    this.inputInch.value = Math.round((cm / 2.54) * 100) / 100;
  };

  setDisabled = (disabled) => {
    this.inputCm.disabled = disabled;
  };

  addEventListener = (type, cb) => (this.events[type] = cb);
}
