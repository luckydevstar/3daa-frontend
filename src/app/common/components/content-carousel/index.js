import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ContentCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };

    this.onLeftClick = this.onLeftClick.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
  }

  onLeftClick() {
    this.setState({
      index: this.state.index <= 0 ? 0 : this.state.index - 1
    });
  }

  onRightClick() {
    const { data } = this.props;

    this.setState({
      index:
        this.state.index >= data.length - 3
          ? data.length - 3
          : this.state.index + 1
    });
  }

  render() {
    const { data, itemWidth, itemGap } = this.props;
    const { index } = this.state;
    const CarouselListItem = this.props.childComponent;

    const wrapperStyle = {
      left: -index * (itemWidth + itemGap),
      width: data.length * (itemWidth + itemGap) - itemGap
    };

    return (
      <div className="content-carousel">
        <div className="content-carousel-wrapper" style={wrapperStyle}>
          {data && data.length > 0
            ? data.map((item, i) =>
                <CarouselListItem
                  itemData={item}
                  index={i}
                  key={i}
                  {...this.props}
                />
              )
            : null}
        </div>

        <div className="debug-page-controls">
          <pre>Debug controls</pre>
          <p>
            <a onClick={this.onLeftClick}>
              {'<='}
            </a>
            <a onClick={this.onRightClick}>
              {'=>'}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

ContentCarousel.defaultProps = {
  itemWidth: 200,
  itemGap: 20,
  data: []
};

ContentCarousel.propTypes = {
  itemWidth: PropTypes.number,
  itemGap: PropTypes.number,
  data: PropTypes.array
};

export default ContentCarousel;
