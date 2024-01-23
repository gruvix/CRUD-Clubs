export function areInputsValid(tableRow) {
  const validRegex = /^[a-zA-Z\s]*$/;
  let returnValue = true;
  $(tableRow).children().children('input').each((index, input) => {
    if ($(input).val() === '' || !validRegex.test($(input).val())) {
      $(input).addClass('invalid-input');
      returnValue = false;
    } else {
      $(input).removeClass('invalid-input');
    }
  });
  return returnValue;
}
export function prepareEditFields(tableRow) {
  $(tableRow).children().each((index, cell) => {
    $(cell).children('input').removeClass('invalid-input');
    const cellText = $(cell).children('span').text();
    $(cell).children('input').val(cellText);
  });
}
export function enableEditMode(tableRow) {
  $('#add-player-button').hide();
  $('.edit').hide();
  $('.remove').hide();
  $(tableRow).children().children('.apply').show();
  $(tableRow).children().children('.cancel').show();
  $(tableRow).children().children('span').hide();
  $(tableRow).children().children('input').show()
    .first()
    .trigger('focus')
    .trigger('select');
  if (tableRow.id === 'add-player-row') {
    $('#confirm-player-button').show();
    $('#cancel-player-button').show();
  }
}
export function applyEditField(tableRow) {
  $(tableRow).children().each((index, cell) => {
    const newText = $(cell).children('input').val();
    $(cell).children('span').text(newText);
  });
}
export function disableEditMode() {
  $('.edit').show();
  $('.remove').show();
  $('span').show();
  $('.apply').hide();
  $('.cancel').hide();
  $('input').hide();
  $('#add-player-button').show();
  $('#confirm-player-button').hide();
  $('#cancel-player-button').hide();
}
function isInputEqualToSpan(tableRow) {
  let returnValue = true;
  $(tableRow).children().each((index, cell) => {
    const spanText = $(cell).children('span').text();
    const inputText = $(cell).children('input').val();
    if (inputText !== undefined && inputText !== spanText) returnValue = false;
  });
  return returnValue;
}
export function submitChanges(tableRow, updateCallback) {
  disableEditMode();
  if (isInputEqualToSpan(tableRow)) return;
  applyEditField(tableRow);
  updateCallback(tableRow);
}
