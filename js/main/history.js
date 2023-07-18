App.setup_history = () => {
  App.history_filter_modes = [
    [App.separator_string],
    [`star`, `Has Star`],
  ]

  App.setup_item_window(`history`)

  browser.history.onVisited.addListener((info) => {
    if (App.window_mode === `history`) {
      App.insert_item(`history`, info)
    }
  })
}

App.history_time = () => {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

App.get_history = async (query = ``, by_what = `all`) => {
  App.log(`Getting history`)
  let set = new Set()
  let parts = query.split(`|`).map(x => x.trim().toLowerCase())

  for (let part of parts) {
    try {
      let ans = await browser.history.search({
        text: part,
        maxResults: App.max_items,
        startTime: App.history_time()
      })

      ans = App.filter_get_items(ans, part, by_what)

      for (let a of ans) {
        set.add(a)
      }
    }
    catch (err) {
      App.log(err, `error`)
      return []
    }
  }

  let results = Array.from(set)

  results.sort((a, b) => {
    return a.lastVisitTime > b.lastVisitTime ? -1 : 1
  })

  App[`last_history_query`] = query
  return results.slice(0, App.max_items)
}

App.history_action = (item) => {
  App.item_action(item)
}

App.history_action_alt = (item) => {
  App.open_items(item, true)
}