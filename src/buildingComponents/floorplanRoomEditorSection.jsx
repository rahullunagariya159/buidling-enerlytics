import React from "react";
import CustomTitle from "./customTitle";

export default class FloorPlanRoomEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tags: [],
      newTag: "",
    };
  }

  componentDidMount = () => {
    const { room } = this.props;
    if (!room) return;
    const { name, tags } = room;
    this.setState({ name, tags });
  };

  UNSAFE_componentWillReceiveProps = (props) => {
    const prevRoom = this.props.room;
    const room = props.room;
    if (prevRoom && room && prevRoom.name !== room.name) {
      this.setState({ name: room.name, tags: room.tags });
    }
  };

  handleNameChanged = () => {
    const { name } = this.state;
    const { room } = this.props;
    if (!room) return;
    room.setName(name);
    this.props.onUpdate();
  };

  handleAddNewTag = () => {
    const { room } = this.props;
    const { tags, newTag } = this.state;
    if (!room || !newTag || tags.includes(newTag)) return;
    const newTags = [...tags];
    newTags.push(newTag);
    room.tags = newTags;
    this.setState({ tags: newTags, newTag: "" }, this.props.onUpdate);
  };

  handleRemoveTags = (index) => {
    const { room } = this.props;
    if (!room) return;
    const newTags = [...this.state.tags];
    newTags.splice(index, 1);
    room.tags = newTags;
    this.setState({ tags: newTags }, this.props.onUpdate);
  };

  _renderTags = () => {
    const { tags, newTag } = this.state;
    return (
      <div>
        <h3 style={{ fontWeight: 500 }}>Tags</h3>
        <div>
          <label htmlFor="tag-input">New Tag</label>
          <input
            id="tag-input"
            value={newTag}
            onChange={(e) => this.setState({ newTag: e.target.value })}
            onKeyDown={(e) => e.keyCode === 13 && this.handleAddNewTag()}
          />
        </div>
        <div style={{ paddingTop: 10 }}>
          {tags.map((tag, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #3575a5",
                borderRadius: 3,
                display: "inline-block",
                padding: 5,
                margin: 3,
              }}
            >
              <span>{tag}</span>
              <span
                className="fa fa-close"
                style={{ marginLeft: 10 }}
                onClick={() => this.handleRemoveTags(index)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="property-section">
        <CustomTitle
          title="Edit Room Properties"
          onClose={this.props.onClose}
        />
        <div className="input-container">
          <label>Name</label>
          <input
            value={this.state.name}
            onChange={(e) =>
              this.setState({ name: e.target.value }, this.handleNameChanged)
            }
          />
        </div>
        {this._renderTags()}
      </div>
    );
  }
}
