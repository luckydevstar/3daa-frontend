import { AtomicBlockUtils, EditorState } from 'draft-js';

/**
 * Adds a custom block with specified data and entity type.
 * @param  {Object} editorState Draft JS editor state.
 * @param  {String} type        Entity type, in caps.
 * @param  {Object} entityData  Data that should be passed to the final component.
 * @return {Object}             The resulting block.
 */
export default (editorState, type, entityData) => {
  if (!type || typeof type !== 'string') {
    throw new Error('Incorrect entity type variable type being passed.');
  }
  if (!entityData || typeof entityData !== 'object') {
    throw new Error('Incorrect entity data variable type being passed.');
  }
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    type,
    'IMMUTABLE',
    entityData
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
};
