/// <reference types="jquery" />

export function prepareEditFields(tableRow) {
  for (let cellIndex = 0; cellIndex < tableRow.children.length; cellIndex += 1) {
    const cell = tableRow.children[cellIndex];
    const cellText = $(cell).children('span').text();
    $(cell).children('input').val(cellText);
  }
}
