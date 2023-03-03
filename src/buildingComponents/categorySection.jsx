import React from "react";
import CustomTitle from "./customTitle";

export default class CategorySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: -1,
      searchKey: "",
    };
  }

  filterCategories = (categories) => {
    const { searchKey } = this.state;
    const res = [];
    categories.forEach((item) => {
      const styles = [];
      item.styles.forEach((style) => {
        if (!searchKey || !searchKey.length) {
          styles.push(style);
          return;
        }
        if (style.name.toLowerCase().includes(searchKey.toLowerCase()))
          styles.push(style);
      });
      res.push({
        category: item.category,
        styles,
      });
    });

    return res;
  };

  renderProducts = (products) => {
    return (
      <div className="styles-section">
        {products &&
          Array.isArray(products) &&
          products.map((item, index) => (
            <div
              key={index}
              className="styles-item"
              onClick={() =>
                typeof this.props.onProductClicked === "function" &&
                this.props.onProductClicked(item)
              }
              onDragStart={(e) => {
                e.dataTransfer.setData("info", JSON.stringify(item));
              }}
            >
              <img alt="thumbnail" src={item.image} />
              <div className="tip">{item.name}</div>
            </div>
          ))}
      </div>
    );
  };

  render() {
    const { items } = this.props;
    const { activeCategory } = this.state;
    const categories = this.filterCategories(items);
    return (
      <div className="category-section">
        <CustomTitle title="Categories" onClose={this.props.onClose} />
        <div>
          <input
            className="search-box"
            placeholder="search"
            value={this.state.searchKey}
            onChange={(e) => this.setState({ searchKey: e.target.value })}
          />
        </div>
        {Array.isArray(categories) &&
          categories.map((item, index) => (
            <div key={index}>
              <div
                className={`category-item ${
                  index === activeCategory ? "active" : ""
                }`}
                onClick={() =>
                  this.setState({
                    activeCategory: index === activeCategory ? -1 : index,
                  })
                }
              >
                {`${item.category} `}
                <span
                  style={{ color: "#aaa" }}
                >{`(${item.styles.length})`}</span>
              </div>
              {index === activeCategory && this.renderProducts(item.styles)}
            </div>
          ))}
      </div>
    );
  }
}
