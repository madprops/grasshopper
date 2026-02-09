App.search_duckduckgo = (term) => {
  let base_url = `https://duckduckgo.com/`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?q=${encoded_term}`
  App.open_tab({url})
}

App.search_brave = (term) => {
  let base_url = `https://search.brave.com/search`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?q=${encoded_term}`
  App.open_tab({url})
}

App.search_bing = (term) => {
  let base_url = `https://www.bing.com/search`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?q=${encoded_term}`
  App.open_tab({url})
}

App.search_google = (term) => {
  let base_url = `https://www.google.com/search`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?q=${encoded_term}`
  App.open_tab({url})
}

App.search_youtube = (term) => {
  let base_url = `https://www.youtube.com/results`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?search_query=${encoded_term}`
  App.open_tab({url})
}

App.search_wikipedia = (term) => {
  let base_url = `https://en.wikipedia.org/w/index.php`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?search=${encoded_term}&title=Special:Search&go=Go`
  App.open_tab({url})
}

App.search_google_images = (term) => {
  let base_url = `https://www.google.com/search`
  let encoded_term = encodeURIComponent(term)
  let url = `${base_url}?q=${encoded_term}&tbm=isch`
  App.open_tab({url})
}