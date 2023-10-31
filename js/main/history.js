App.setup_history = () => {
  browser.history.onVisited.addListener((info) => {
    App.debug(`History Visited`)

    if (App.active_mode === `history`) {
      App.history_changed = true
    }
  })
}

App.history_time = (deep = false) => {
  let months = App.get_setting(`history_max_months`)

  if (deep) {
    months = App.get_setting(`deep_history_max_months`)
  }

  return App.now() - (1000 * 60 * 60 * 24 * 30 * months)
}

App.get_history = async (query = ``, deep = false) => {
  App.getting(`history`)
  let results
  let max_items = App.get_setting(`max_search_items`)

  if (deep) {
    max_items = App.get_setting(`deep_max_search_items`)
  }

  try {
    results = await browser.history.search({
      text: query,
      maxResults: max_items,
      startTime: App.history_time(deep)
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  results.sort((a, b) => {
    return a.lastVisitTime > b.lastVisitTime ? -1 : 1
  })

  App.last_history_query = query
  return results
}

App.history_action = (item) => {
  App.select_item({item: item, scroll: `nearest_smooth`})
  App.on_action(`history`)
  App.focus_or_open_item(item)
}