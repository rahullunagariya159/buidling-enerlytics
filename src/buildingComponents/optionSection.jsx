import React from "react";
import CustomAccordion from "./customAccordion";

export default class OptionSection extends React.Component {
  handleMaterialChange = (target, material) => {
    this.props.onMaterialChange(target, material);
  };

  handleStyleChange = (hide_name, show_name) => {
    this.props.onStyleChange(hide_name, show_name);
  };

  renderMaterialSection = () => {
    const { materials } = this.props.info.metadata;
    if (!Array.isArray(materials)) return;
    return (
      <div>
        {materials.map((item, index) => (
          <div key={index}>
            <CustomAccordion label={item.label}>
              <div className="textures-container">
                {item.types.map((type, i) => (
                  <div
                    key={i}
                    className="texture-item"
                    onClick={() => {
                      let target = item.name_in_model;
                      let material = type;
                      this.handleMaterialChange(target, material);
                    }}
                  >
                    <img
                      alt={type.label}
                      src={type.texture}
                      className="thumbnail"
                    />
                    <div className="label">{type.label}</div>
                  </div>
                ))}
              </div>
            </CustomAccordion>
          </div>
        ))}
      </div>
    );
  };

  renderStyleSection = () => {
    const { styles } = this.props.info.metadata;
    if (!Array.isArray(styles)) return;
    return (
      <div style={{ paddingTop: 10 }}>
        {styles.map((item, index) => (
          <div key={index}>
            <CustomAccordion label={item.label}>
              <div className="styles-container">
                {item.types.map((type, i) => (
                  <div
                    key={i}
                    className="style-item"
                    onClick={() => {
                      let hide_name = item.name_in_model;
                      let show_name = type.name_in_model;
                      this.handleStyleChange(hide_name, show_name);
                    }}
                  >
                    {type.thumbnail && (
                      <img
                        alt={type.label}
                        src={type.thumbnail}
                        className="thumbnail"
                      />
                    )}
                    <div className="label">{type.label}</div>
                  </div>
                ))}
              </div>
            </CustomAccordion>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { info } = this.props;
    return (
      <div className="option-section">
        {!info && <p>No item selected</p>}
        {info && this.renderMaterialSection()}
        {info && this.renderStyleSection()}
      </div>
    );
  }
}
