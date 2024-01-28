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
