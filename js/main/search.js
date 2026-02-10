App.query_search_engine = (term) => {
  let se = App.get_setting(`search_engine`)

  if (!se) {
    return
  }

  App.use_search_engine(se, term)
}

App.use_search_engine = (url, term) => {
  let encoded_term = encodeURIComponent(term)
  url = url.replaceAll(`%s`, encoded_term)
  App.open_tab({url})
}