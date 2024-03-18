/**
 * Updates the parameter of the team given the row of the value
 * @param {HTMLElement} - The row containing the parameter
 */
export default async function updateTeamParameter(tableRow) {
  const parameter = $(tableRow).find('[id]').first().attr('id');
  const newValue = $(tableRow).children().children('input').val();
  const updatedData = {};
  updatedData[parameter] = newValue;
  const requestBody = JSON.stringify(updatedData);

  const href = $('#team-table').attr('href');
  const response = await fetch(href, {
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
