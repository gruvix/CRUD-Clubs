/// <reference types="jquery" />

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
  $(tableRow).children().children('input').show();
}
