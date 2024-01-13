export function prepareEditField(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('span').text();
  $(values).children('input').val(text);
}

export function applyEditField(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('input').val();
  $(values).children('span').text(text);
}
export function enableEditMode(tableRow) {
  const values = tableRow.children[1];
  const buttons = tableRow.children[2];
  $('.edit').hide();
  $(buttons).children('.apply').show();
  $(values).children('input').show().trigger('focus')
    .trigger('select');
  $(values).children('span').hide();
}
export function disableEditMode(tableRow) {
  const values = tableRow.children[1];
  const buttons = tableRow.children[2];
  $('.edit').show();
  $(buttons).children('.apply').hide();
  $(values).children('input').hide();
  $(values).children('span').show();
}
/**
 * Updates the parameter of the team given the row of the value
 * @param {HTMLElement} - The row containing the parameter
 */
async function updateTeamParameter(tableRow) {
  const parameterCell = tableRow.children[1];
  const parameter = parameterCell.id;
  const newValue = $(parameterCell).children('input').val();
  const teamId = $('#team-id').val();
  const updatedData = {};
  updatedData[parameter] = newValue;
  const requestBody = JSON.stringify(updatedData);

  const response = await fetch(`/user/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert('Error: could not update team');
  }
}
export function isInputEqualToValid(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('input').val();
  const validText = $(values).children('span').text();
  return text === validText;
}
export function confirmEdit(tableRow) {
  disableEditMode(tableRow);
  if (isInputEqualToValid(tableRow)) return;
  applyEditField(tableRow);
  updateTeamParameter(tableRow);
}
