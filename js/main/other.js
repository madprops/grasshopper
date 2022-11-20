// Do a search
App.search = function (query) {
  query = query.replace(/^\?+/, "").trim()
  
  browser.search.search({
    query: query
  })

  window.close()
}