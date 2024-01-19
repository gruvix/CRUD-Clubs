export function prepareEditFields(tableRow) {
  for (let cellIndex = 0; cellIndex < tableRow.children.length; cellIndex += 1) {
    const cell = tableRow.children[cellIndex];
    const cellText = $(cell).children('span').text();
    $(cell).children('input').val(cellText);
  }
}
export function enableEditMode(tableRow) {
  $('.edit').hide();
  $('.remove').hide();
  $(tableRow).children().children('.apply').show();
  $(tableRow).children().children('span').hide();
  $(tableRow).children().children('input').show()
    .first()
    .trigger('focus')
    .trigger('select');
}
export function applyEditField(tableRow) {
  for (let cellIndex = 0; cellIndex < tableRow.children.length; cellIndex += 1) {
    const cell = tableRow.children[cellIndex];
    const newText = $(cell).children('input').val();
    $(cell).children('span').text(newText);
  }
}
export function disableEditMode() {
  $('.edit').show();
  $('.remove').show();
  $('span').show();
  $('.apply').hide();
  $('input').hide();
}
function isInputEqualToSpan(tableRow) {
  for (let cellIndex = 0; cellIndex < tableRow.children.length; cellIndex += 1) {
    const cell = tableRow.children[cellIndex];
    const spanText = $(cell).children('span').text();
    const inputText = $(cell).children('input').val();
    if (inputText !== undefined && inputText !== spanText) return false;
  }
  return true;
}
export function submitChanges(tableRow, updateCallback) {
  disableEditMode();
  if (isInputEqualToSpan(tableRow)) return;
  applyEditField(tableRow);
  updateCallback(tableRow);
}
