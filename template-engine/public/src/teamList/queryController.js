export function toggleCardVisibility(card, shouldShow) {
  if (shouldShow) {
    $(card).show();
  } else {
    $(card).hide();
  }
}
export function adjustTitles() {
  $('h5').each((index, title) => {
    if (title.offsetHeight > 50) {
      title.style.fontSize = '100%';
    }
  });
}
