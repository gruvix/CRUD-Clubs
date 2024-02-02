export function addPlayerRow() {
  const $table = $('#players-table');
  const $template = $('#new-player-template');
  const $newPlayerRow = $template.contents().clone(true);

  $($table).children('thead').children().first()
    .after($newPlayerRow);
}
export function removePlayerRow(row) {
  $(row).remove();
}
export function toggleUploadButton(fileName, isFileValid) {
  $('#upload-image-button').hide();
  if(isFileValid) {
    $('#invalid-image-button').hide();
    $('#uploaded-image-button').show().find('span').text(fileName);
    $('#submit-team-button').prop('disabled', false);
  } else {
    const filetype = fileName.split('.').pop();
    const text = `INVALID FILE TYPE (${filetype})`;
    $('#submit-team-button').prop('disabled', true);
    $('#uploaded-image-button').hide();
    $('#invalid-image-button').show().find('span').text(text);
  }
}
