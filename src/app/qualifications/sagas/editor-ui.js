import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NativeListener from 'react-native-listener';

class EditorUi extends Component {
  constructor(props) {
    super(props);
    // Define menu options
    this.buttons = [
      {
        action: 'text-editor',
        icon: 'font',
        submenu: [
          {
            type: 'ACTION_INLINE_STYLE',
            action: 'BOLD',
            icon: 'bold'
          },
          {
            type: 'ACTION_INLINE_STYLE',
            action: 'ITALIC',
            icon: 'italic'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'header-one',
            icon: 'header header-one'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'header-two',
            icon: 'header header-two'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'header-three',
            icon: 'header header-three'
          },
          {
            type: 'ACTION_INLINE_STYLE',
            action: 'highlight',
            icon: 'font highlight'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'blockquote',
            icon: 'quote-right'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'ordered-list-item',
            icon: 'list-ol'
          },
          {
            type: 'ACTION_TOGGLE_BLOCK',
            action: 'unordered-list-item',
            icon: 'list'
          }
        ]
      },
      {
        type: 'ACTION_ADD_LINK',
        action: 'LINKBLOCK',
        submenu: [],
        icon: 'chain'
      },
      {
        type: 'ACTION_ADD_IMAGE',
        action: 'add-image',
        icon: 'file-image-o',
        submenu: []
      },
      {
        type: 'ACTION_ADD_VIDEO',
        action: 'insert-video',
        icon: 'file-video-o',
        submenu: []
      },
      {
        type: 'ACTION_ADD_ACTIVITY',
        icon: 'trophy',
        submenu: []
      },
      {
        type: 'DEBUG_EDITOR_STATE',
        icon: 'bug',
        submenu: []
      },
      {
        type: 'DEBUG_ACTIVITY_MAP',
        icon: 'map-o',
        submenu: []
      }
    ];

    this.state = {
      submenuActive: false,
      activeTab: null
    };
  }

  /**
   * Set UI active tab binding.
   */
  setActiveTab(id) {
    id = parseInt(id);
    if (id === this.state.activeTab) {
      this.setState({ activeTab: null });
    } else {
      this.setState({ activeTab: id });
    }
  }

  /**
   * UI open/close bindings.
   */
  open() {
    this.setState({ active: true });
  }

  close() {
    this.setState({ active: false, activeTab: null, submenuActive: false });
  }

  closeSubmenu() {
    this.setState({ activeTab: null, submenuActive: false });
  }

  toggleSubmenu() {
    this.setState({
      submenuActive: !this.state.submenuActive
    });
  }

  /**
   * General UI click handler.
   */
  handleClick(e) {
    e.preventDefault();
    let id =
      e.target.classList[0] !== 'hud-item'
        ? e.target.parentNode.id
        : e.target.id;

    if (id.indexOf('-') !== -1) {
      id = id.split('-');
      this.props.callback(this.buttons[id[0]].submenu[id[1]]);
      return true;
    }

    if (this.buttons[id].submenu.length) {
      this.toggleSubmenu();
      this.setActiveTab(id);
    } else {
      this.setState({ submenuActive: false, activeTab: null });
    }

    if (!this.buttons[id].submenu.length) {
      this.props.callback(this.buttons[id]);
    }

    return false;
  }

  render() {
    const { style, editorState } = this.props;
    const uiItemClasses = key =>
      classNames('hud-item', {
        active: this.state.activeTab === key
      });
    const uiSubmenuClasses = classNames('submenu', {
      hidden: !this.state.submenuActive
    });

    const currentStyle = editorState && editorState.getCurrentInlineStyle();
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);

    return (
      <div className="editor-ui" style={style}>
        {this.buttons.map((button, key) => (
          <div key={key}>
            <NativeListener onMouseDown={e => this.handleClick(e)}>
              <div id={key} className={uiItemClasses(key)}>
                <i className={`fa fa-${button.icon}`} />
              </div>
            </NativeListener>
            {button.submenu && (
              <div className={uiSubmenuClasses}>
                {button.submenu.map((submenu, key2) => (
                  <NativeListener
                    key={key2}
                    onMouseDown={e => this.handleClick(e)}
                  >
                    <div
                      id={`${key}-${key2}`}
                      className={classNames('hud-item', {
                        applied:
                          currentStyle.has(submenu.action) ||
                          currentContentBlock.type === submenu.action
                      })}
                    >
                      <i className={`fa fa-${submenu.icon}`} />
                    </div>
                  </NativeListener>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

EditorUi.propTypes = {
  callback: PropTypes.func.isRequired
};

export default EditorUi;
