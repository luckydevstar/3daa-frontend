import React from 'react';
import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown';
import { equals } from 'ramda';
import { Text } from 'app/intl';
import Isvg from 'react-inlinesvg';

import IconFlagCN from 'images/flag_cn.svg';
import IconFlagUK from 'images/flag_uk.svg';

class LangMenu extends React.Component {
  constructor() {
    super();
    this.bindListeners = this.bindListeners.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  componentDidMount() {
    this.bindListeners();
  }

  bindListeners() {
    document
      .querySelector('.lang-menu .dropdown__content')
      .addEventListener('click', this.closeDropdown);
  }

  closeDropdown() {
    this.dropdown.hide();
  }

  render() {
    const { currentLang, toggleLanguage } = this.props;

    return (
      <Dropdown
        className="lang-menu navbar-item has-sa"
        ref={el => {
          this.dropdown = el;
        }}
      >
        <DropdownTrigger>
          <div className="menu-trigger">
            {equals(currentLang, 'cn') ? (
              <Isvg key="cn" src={IconFlagCN} />
            ) : (
              <Isvg key="en" src={IconFlagUK} />
            )}
            <div className="caret" />
          </div>
        </DropdownTrigger>
        <DropdownContent>
          {equals(currentLang, 'en') ? (
            <div className="menu-content" onClick={() => toggleLanguage('cn')}>
              <Isvg key="cn" src={IconFlagCN} /> <Text iKey="chinese" />
            </div>
          ) : (
            <div className="menu-content" onClick={() => toggleLanguage('en')}>
              <Isvg key="en" src={IconFlagUK} /> <Text iKey="english" />
            </div>
          )}
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default LangMenu;
