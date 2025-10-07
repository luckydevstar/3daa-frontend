import React, { Component } from 'react';
import { addIndex, any, equals, map, or, isEmpty } from 'ramda';

const VideoTag = ({ onTagRemoved, tag, index }) =>
  <li onClick={() => onTagRemoved(index)}>
    {tag}
    <i className="fa fa-close" />
  </li>;
const mapIndexed = addIndex(map);

class FormTags extends Component {
  constructor(props) {
    super(props);

    this.onTagAdded = this.onTagAdded.bind(this);
    this.onTagRemoved = this.onTagRemoved.bind(this);

    this.state = { tags: this.props.input.value };
  }

  onTagAdded(event, flag) {
    if (isEmpty(this.textInput.value)) return;
    if (or(any(equals(event.keyCode))([13, 188]), flag)) {
      event.preventDefault();
      if (any(equals(this.textInput.value))(this.state.tags) === false) {
        const newTags = [...this.state.tags, this.textInput.value];
        this.setState({
          tags: newTags
        });
        this.props.input.onChange(newTags);
        this.textInput.value = '';
      }
    }
  }

  onTagRemoved(index) {
    const newTags = this.state.tags.filter((tag, i) => i !== index);
    this.setState({
      tags: newTags
    });
    this.props.input.onChange(newTags);
  }

  render() {
    const { tags } = this.state;
    const { onTagAdded, onTagRemoved } = this;

    return (
      <div className="tagging-form_container">
        <div className="tag-add_container">
          <input
            type="text"
            onKeyDown={e => onTagAdded(e, false)}
            ref={inputValue => {
              this.textInput = inputValue;
            }}
            placeholder="Add a tag"
          />
          <span className="btn-add" onClick={e => onTagAdded(e, true)}>
            <i className="fa fa-plus" />
          </span>
        </div>
        <div className="react-tags">
          <ul className="react-tags__container">
            {tags &&
              mapIndexed(
                (tag, index) =>
                  <VideoTag
                    {...{
                      key: index,
                      onTagRemoved,
                      tag,
                      index
                    }}
                  />,
                tags
              )}
          </ul>
        </div>
      </div>
    );
  }
}

export default FormTags;
