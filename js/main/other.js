// Do a search
App.search = function (query) {
  browser.search.search({
    query: query
  })

  window.close()
}