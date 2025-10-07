export const isSelected = (item, selectedItems) => {
  if (!selectedItems || selectedItems.length <= 0) return false;

  return selectedItems.find(i => i.centre_id == item.centre_id);
};
