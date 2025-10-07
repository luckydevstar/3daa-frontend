import handleImageUpload from './subform-image-handling';
import React from 'react';

class DragDropOrder extends React.Component {
  constructor(props) {
    super(props);

    const itemFields = {
      title: '',
      image: ''
    };

    const defaultFormState = {
      activityText: '',
      items: [itemFields]
    };

    this.state = {
      formState: props.formState || defaultFormState,
      itemFields: { ...itemFields }
    };
    this.setOrderItemField = this.setOrderItemField.bind(this);
    this.setActivityText = this.setActivityText.bind(this);
    this.elementActivityText = this.elementActivityText.bind(this);
    this.elementItemsHead = this.elementItemsHead.bind(this);
    this.elementItems = this.elementItems.bind(this);
    this.elementAddItem = this.elementAddItem.bind(this);
    this.addOrderItem = this.addOrderItem.bind(this);
    this.removeOrderItem = this.removeOrderItem.bind(this);
  }

  setOrderItemField(field, e, i) {
    const { formState } = this.state;
    let value;
    if (field === 'image') {
      value = e;
    } else {
      value = e.target.value;
    }
    const newItems = [...formState.items];
    newItems[i][field] = value;
    this.setState({
      formState: {
        ...formState,
        ...{ items: newItems }
      }
    });
  }

  setActivityText(e) {
    const { formState } = this.state;
    const value = e.target.value;
    this.setState({
      formState: {
        ...formState,
        ...{ activityText: value }
      }
    });
  }

  /**
   * Form elements
   */

  elementActivityText() {
    const { formState } = this.state;
    const { setActivityText } = this;
    return (
      <div className="control m-b-25">
        <label htmlFor="question-propmpt" className="label">
          Activity question or answer prompt
          <span className="is-text-danger">*</span>
        </label>
        <textarea
          className="textarea"
          onChange={setActivityText}
          value={formState.activityText}
        />
      </div>
    );
  }

  elementItemsHead() {
    return (
      <div className="columns">
        <div className="column is-1">
          <div className="columns-head">
            <label htmlFor="order" className="control label">
              Order
            </label>
          </div>
        </div>
        <div className="column is-11">
          <div className="columns-head">
            <label htmlFor="item-title" className="control label">
              Item Title
            </label>
          </div>
        </div>
      </div>
    );
  }

  elementItems() {
    const { formState } = this.state;
    const { setOrderItemField, removeOrderItem } = this;
    return formState.items.map((fields, i) => (
      <div key={i} className="columns">
        <div className="column is-1 order-cell">{i + 1}.</div>
        <div className="column is-5">
          <div className="columns-body">
            <input
              className="input"
              value={fields.title}
              type="text"
              placeholder="Name here"
              onChange={e => setOrderItemField('title', e, i)}
            />
          </div>
        </div>
        <div className="column is-6 down-col">
          <div className="columns-body">
            <div className="image-container">
              {fields.image.length ? (
                <div
                  className="image"
                  style={{ backgroundImage: `url(${fields.image})` }}
                />
              ) : (
                <div className="image bg-is-info">
                  <span className="icon">
                    <i className="fa fa-picture-o" />
                  </span>
                </div>
              )}
              <input
                className={`image-upload-${i}`}
                type="file"
                onChange={() =>
                  handleImageUpload(i, dataUrl => {
                    setOrderItemField('image', dataUrl, i);
                  })
                }
              />
              <label
                className="is-info is-outlined button"
                htmlFor="add-image"
                onClick={() => {
                  document.querySelector(`.image-upload-${i}`).click();
                  document.querySelector(`.image-upload-${i}`).value = null;
                }}
              >
                Add Image
              </label>
              {formState.items.length > 1 ? (
                <div className="is-text-info delete-container label">
                  <span
                    className="clickable has-text-right"
                    onClick={() => removeOrderItem(i)}
                  >
                    Delete <i className="fa fa-trash-o" />
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ));
  }

  elementAddItem() {
    const { addOrderItem } = this;
    return (
      <div className="has-text-right">
        <a onClick={addOrderItem}>
          <span className="is-text-info">Add Item +</span>
        </a>
      </div>
    );
  }

  /**
   * Form elements end
   */

  /**
   * Form functions start
   */

  addOrderItem() {
    const { formState, itemFields } = this.state;
    const newItems = [...formState.items, { ...itemFields }];
    this.setState({
      formState: {
        ...formState,
        items: newItems
      }
    });
  }

  removeOrderItem(i) {
    const { formState } = this.state;
    const newItems = [...formState.items];
    newItems.splice(i, 1);
    this.setState({
      formState: {
        ...formState,
        items: newItems
      }
    });
  }

  /**
   * Form functions end
   */

  render() {
    const {
      elementActivityText,
      elementItemsHead,
      elementItems,
      elementAddItem
    } = this;

    return (
      <div className="ddoa-container margin-container">
        <p className="content">
          Drag and drop order requires learners to place a series of items in
          the correct order. These items can be just text or text with a
          supporting image.
        </p>
        {elementActivityText()}
        {elementItemsHead()}
        {elementItems()}
        {elementAddItem()}
      </div>
    );
  }
}

export default DragDropOrder;
