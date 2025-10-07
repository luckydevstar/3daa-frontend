// CORE
import React from 'react';
import StyleButton from './style-button';

// ADDONS
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw
} from 'draft-js';

// CONST
// This object provides the styling information for our custom styles
const customStyleMap = {
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0px'
  }
};

const STYLES = [
  { label: 'Bold', style: 'bold' },
  { label: 'Italic', style: 'italic' },
  { label: 'Heading', style: 'heading' }
];

const Controlls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="editor-controls">
      {STYLES.map(type => (
        <StyleButton
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          key={type.style.length + type.label.length}
        />
      ))}
    </div>
  );
};

/**
 * MAIN COMPONENT
 */
class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.initialData) {
      const initialDataRaw = convertFromRaw(JSON.parse(this.props.initialData));
      this.state = {
        editorState: EditorState.createWithContent(initialDataRaw)
      };
    } else {
      this.state = { editorState: EditorState.createEmpty() };
    }
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => {
      this.setState({ editorState });

      // const rawEditorContent = convertToRaw(editorState.getCurrentContent());
      // if (this.props.changeFieldValue) {
      //   this.props.changeFieldValue(
      //     this.props.affectThisField,
      //     this.stringifyIfObject(this.checkIfEmptyAndRetunNull(rawEditorContent))
      //   );
      // }
    };
    this.toggleStyle = toggledStyle => this._toggleStyle(toggledStyle);
  }

  componentDidUpdate() {
    const { editorState } = this.state;

    const rawEditorContent = convertToRaw(editorState.getCurrentContent());
    if (this.props.changeFieldValue) {
      this.props.changeFieldValue(
        this.props.affectThisField,
        this.stringifyIfObject(this.checkIfEmptyAndRetunNull(rawEditorContent))
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  /**
   * COMPONENT METHODS
   */
  stringifyIfObject(rawContent) {
    let result = rawContent;

    if (rawContent !== null && typeof rawContent === 'object') {
      result = JSON.stringify(result);
    }

    return result;
  }

  checkIfEmptyAndRetunNull(rawContent) {
    let result = rawContent;

    if (
      rawContent.blocks &&
      rawContent.blocks.length === 1 &&
      rawContent.blocks[0].text === ''
    ) {
      result = null;
    }
    return result;
  }

  _toggleStyle(toggledStyle) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one Style at a time. Turn off all active styles.
    const nextContentState = Object.keys(customStyleMap).reduce(
      (contentState, style) =>
        Modifier.removeInlineStyle(contentState, selection, style),
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current style.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce(
        (state, style) => RichUtils.toggleInlineStyle(state, style),
        nextEditorState
      );
    }

    // If the style is being toggled on, apply it.
    if (!currentStyle.has(toggledStyle)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledStyle
      );
    }

    this.onChange(nextEditorState);
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="custom-text-editor">
        <Controlls editorState={editorState} onToggle={this.toggleStyle} />
        <div className="editor-root" onClick={this.focus}>
          <Editor
            customStyleMap={customStyleMap}
            editorState={editorState}
            onChange={e => this.onChange(e)}
            placeholder="Write something...."
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

export default TextEditor;
