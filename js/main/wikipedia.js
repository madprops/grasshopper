App.search_wikipedia = (term) => {
  let base_url = `https://en.wikipedia.org/w/index.php`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?search=${encoded_term}&title=Special:Search&go=Go`
  App.open_tab({url})
}