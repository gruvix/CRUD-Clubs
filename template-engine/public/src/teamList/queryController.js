export function toggleCardVisibility(card, shouldShow) {
  if (shouldShow) {
    $(card).show();
  } else {
    $(card).hide();
  }
}
