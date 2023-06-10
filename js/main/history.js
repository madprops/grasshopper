App.setup_history = () => {
  App.history_filter_modes = [
    [`--separator--`],
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

App.get_history = async (text = ``) => {
  App.log(`Getting history`)
  let results

  try {
    results = await browser.history.search({
      text: text,
      maxResults: App.history_max_results,
      startTime: App.history_time()
    })
  }
  catch (err) {
    App.log(err, `error`)
    return []
  }

  return results
}

App.history_action = (item) => {
  App.item_action(item)
}

App.history_action_alt = (item) => {
  App.launch_items(item)
}

App.search_history = async (value) => {
  let items = await App.get_history(value)

  if (App.window_mode !== `history`) {
    return
  }

  App.process_info_list(`history`, items)
}