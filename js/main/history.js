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

App.get_history = async (query = ``) => {
  App.log(`Getting history`)
  let results

  try {
    results = await browser.history.search({
      text: query,
      maxResults: App.max_items,
      startTime: App.history_time()
    })
  }
  catch (err) {
    App.log(err, `error`)
    return []
  }

  App[`last_history_query`] = query
  return results
}

App.history_action = (item) => {
  App.item_action(item)
}

App.history_action_alt = (item) => {
  App.open_items(item, true)
}