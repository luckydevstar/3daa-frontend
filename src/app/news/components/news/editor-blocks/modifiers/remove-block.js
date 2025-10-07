import { EditorState, Modifier, SelectionState } from 'draft-js';

export default (editorState, blockKey) => {
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(blockKey);

  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength()
  });

  const withoutActivity = Modifier.removeRange(
    content,
    targetRange,
    'backward'
  );
  const resetBlock = Modifier.setBlockType(
    withoutActivity,
    withoutActivity.getSelectionAfter(),
    'unstyled'
  );

  const newState = EditorState.push(editorState, resetBlock, 'remove-range');
  return EditorState.forceSelection(newState, resetBlock.getSelectionAfter());
};
