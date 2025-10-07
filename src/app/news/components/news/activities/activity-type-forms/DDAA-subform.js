import React from 'react';
import { findIndex, propEq } from 'ramda';
import handleImageUpload from './subform-image-handling';

class DragDropArea extends React.Component {
  constructor(props) {
    super(props);

    const itemFields = {
      title: '',
      image: '',
      selected: ''
    };

    const defaultFormState = {
      activityText: '',
      items: [itemFields],
      titles: [{ id: this.generateTitleId(), value: '' }]
    };

    this.state = {
      formState: props.formState || defaultFormState,
      itemFields: { ...itemFields }
    };
    this.setTitle = this.setTitle.bind(this);
    this.setOrderItemField = this.setOrderItemField.bind(this);
    this.setActivityText = this.setActivityText.bind(this);
    this.elementActivityText = this.elementActivityText.bind(this);
    this.elementItemsHead = this.elementItemsHead.bind(this);
    this.elementItems = this.elementItems.bind(this);
    this.elementAddItem = this.elementAddItem.bind(this);
    this.elementTitles = this.elementTitles.bind(this);
    this.elementAddTitle = this.elementAddTitle.bind(this);
    this.addTitle = this.addTitle.bind(this);
    this.removeTitle = this.removeTitle.bind(this);
    this.addOrderItem = this.addOrderItem.bind(this);
    this.removeOrderItem = this.removeOrderItem.bind(this);
  }

  setTitle(e, i) {
    const { formState } = this.state;
    const value = e.target.value;
    const newTitles = [...formState.titles];
    newTitles[i].value = value;
    this.setState({
      formState: {
        ...formState,
        titles: newTitles
      }
    });
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
      <div className="control">
        <label htmlFor="activity-text" className="label">
          Activity question or answer prompt
          <span className="is-text-danger">*</span>
        </label>
        <textarea
          name="activity-text"
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
        <div className="column is-2">
          <div className="columns-head">
            <label htmlFor="area-title" className="control label">
              Area title
            </label>
          </div>
        </div>
        <div className="column is-7">
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

    // Get an array of valid titles
    const validTitles = formState.titles.filter(title =>
      /\S/.test(title.value)
    );

    // Get an array of valid, unselected titles
    // const freeTitles = validTitles.filter(title => !find(propEq('selected', title.id))(formState.items));

    // Generate options
    const options = validTitles.map((title, i) => (
      <option key={i} value={title.id}>
        {title.value}
      </option>
    ));

    return formState.items.map((item, i) => (
      <div key={i} className="columns">
        <div className="column is-2">
          <div className="select">
            <select
              value={item.selected}
              onChange={e => setOrderItemField('selected', e, i)}
            >
              <option value="">--</option>
              {options}
            </select>
          </div>
        </div>
        <div className="column is-5">
          <div className="columns-body">
            <input
              className="input"
              value={item.title}
              type="text"
              placeholder="Name here"
              onChange={e => setOrderItemField('title', e, i)}
            />
          </div>
        </div>
        <div className="column is-5 down-col">
          <div className="columns-body">
            <div className="image-container">
              {item.image.length ? (
                <div
                  className="image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              ) : (
                <div className="image bg-is-info">
                  <p className="vertical-center has-text-centered ">
                    <span className="icon">
                      <i className="fa fa-picture-o" />
                    </span>
                  </p>
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
                htmlFor={'none'}
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
                    <i className="fa fa-trash-o" />
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

  elementTitles() {
    const { formState } = this.state;
    const { setTitle, removeTitle } = this;
    return formState.titles.map((title, i) => (
      <div key={i}>
        {!i ? (
          <label htmlFor="area-title" className="label">
            Area title
            <span className="is-text-danger">*</span>
          </label>
        ) : null}
        <div className="columns">
          <div className="column is-10">
            <div className="control" key={i}>
              <input
                className="input"
                onChange={e => setTitle(e, i)}
                value={title.value}
                type="text"
              />
            </div>
          </div>
          <div className="column is-2">
            {formState.titles.length > 1 ? (
              <div className="is-text-info delete-container label">
                <span
                  className="clickable has-text-right"
                  onClick={() => removeTitle(i)}
                >
                  Delete <i className="fa fa-trash-o" />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ));
  }

  elementAddTitle() {
    const { addTitle } = this;
    return (
      <div className="has-text-right">
        <a onClick={addTitle}>
          <span className="is-text-info">Add area title +</span>
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

  assignIdToTitle() {
    const { formState } = this.state;
    let id;
    while (!id) {
      const temp = this.generateTitleId();
      if (findIndex(propEq('id', temp))(formState.titles) === -1) id = temp;
    }
    return id;
  }

  generateTitleId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  addTitle() {
    const { formState } = this.state;
    this.setState({
      formState: {
        ...formState,
        titles: [...formState.titles, { id: this.assignIdToTitle(), value: '' }]
      }
    });
  }

  removeTitle(i) {
    const { formState } = this.state;
    const newItems = [...formState.items];
    const newTitles = [...formState.titles];
    const iI = findIndex(propEq('selected', newTitles[i].id))(newItems);
    if (iI > -1) {
      newItems[iI].selected = '';
    }
    newTitles.splice(i, 1);
    this.setState({
      formState: {
        ...formState,
        items: newItems,
        titles: newTitles
      }
    });
  }

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
      elementAddItem,
      elementTitles,
      elementAddTitle
    } = this;

    return (
      <div className="ddaa-container margin-container">
        <p className="content">
          Drag and drop area requires learners to place a series of items in the
          correct area. These items can be just text or text with a supporting
          image.
        </p>
        {elementActivityText()}
        <div className="m-b-15">{elementTitles()}</div>
        {elementAddTitle()}
        {elementItemsHead()}
        {elementItems()}
        {elementAddItem()}
      </div>
    );
  }
}

export default DragDropArea;
