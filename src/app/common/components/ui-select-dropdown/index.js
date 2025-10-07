import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import { find, propEq } from 'ramda';
import { noop } from 'app/common/util/helpers';
import Select from './select';
import Dropdown from './dropdown';

class UISelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: props.defaultKey,
      left: 0,
      top: 0,
      width: 200
    };

    this.changeSector = this.changeSector.bind(this);
    this.openPortal = this.openPortal.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { defaultKey } = this.state;
    // if (nextProps.defaultKey != defaultKey) {
    //   this.setState({
    //     selectedKey: nextProps.defaultKey
    //   });
    // }
  }

  changeSector(key) {
    this.setState(
      {
        selectedKey: key
      },
      () => {
        setTimeout(() => {
          this.portal.closePortal();
        }, 100);
        this.props.onChange(key);
      }
    );
  }

  checkPosition() {
    if (this.select) {
      const rect = this.select.getClientRects();

      this.setState({
        left: rect[0].x,
        top: rect[0].y,
        width: rect[0].width
      });
    }
  }

  openPortal() {
    this.checkPosition();
    setTimeout(() => {
      this.portal.openPortal();
    }, 100);
  }

  render() {
    // const { flipped, extraClass } = this.state;
    const { dropdownList, defaultTxt } = this.props;
    const { selectedKey, left, top, width } = this.state;

    const selectedItem = dropdownList.find(lItem => lItem.key === selectedKey);
    const selectedTxt = selectedItem && selectedItem.name;

    return (
      <div
        className="ui-select-dropdown"
        ref={node => {
          this.node = node;
        }}
      >
        <div
          ref={el => {
            this.select = el;
          }}
          style={{ width: '100%' }}
          onClick={this.openPortal}
        >
          <Select
            {...{
              selectedTxt,
              defaultTxt: selectedTxt || defaultTxt
            }}
          />
        </div>
        <Portal
          closeOnEsc
          ref={c => {
            this.portal = c;
          }}
        >
          <Dropdown
            {...{
              defaultTxt,
              selectedKey,
              dropdownList,
              left,
              top,
              width,
              changeSector: this.changeSector
            }}
          />
        </Portal>
      </div>
    );
  }
}

UISelectDropdown.propTypes = {
  dropdownList: PropTypes.array,
  onChange: PropTypes.func,
  defaultTxt: PropTypes.string,
  defaultKey: PropTypes.any
};

UISelectDropdown.defaultProps = {
  dropdownList: [],
  onChange: noop,
  defaultTxt: 'All Sectors',
  defaultKey: ''
};

export default UISelectDropdown;
