function toggleCardVisibility(card, shouldShow) {
  if (shouldShow) {
    $(card).show();
  } else {
    $(card).hide();
  }
}
export function compareSearch() {
  const searchValue = $('#search-input').val().toLowerCase();
  const selectedOption = $('#search-options-button').text();
  $('.card-title').each((index, element) => {
    const $teamName = $(element).text().toLowerCase();
    const $card = $(element).parent().parent();
    const matchesName = $teamName.includes(searchValue);
    const isDefault = $($card).attr('data-isDefaultTeam') === 'true';
    let shouldShow = false;
    switch (selectedOption) {
      case 'All teams':
        shouldShow = matchesName;
        break;
      case 'Default teams':
        if (isDefault && matchesName) {
          shouldShow = true;
        }
        break;
      case 'Custom teams':
        if (!isDefault && matchesName) {
          shouldShow = true;
        }
        break;
      default:
        shouldShow = false;
        break;
    }
    toggleCardVisibility($card, shouldShow);
  });
}
export function adjustTitles() {
  $('h5').each((index, title) => {
    if (title.offsetHeight > 50) {
      title.style.fontSize = '100%';
    }
  });
}
