App.setup_history = () => {
  if (App.setup_history_ready) {
    return
  }

  browser.history.onVisited.addListener((info) => {
    App.debug(`History Visited`)

    if (App.active_mode === `history`) {
      App.history_changed = true
    }
  })

  App.setup_history_ready = true
}

App.history_time = (deep = false) => {
  let months = App.get_setting(`history_max_months`)

  if (deep) {
    months = App.get_setting(`deep_history_max_months`)
  }

  return App.now() - (App.DAY * 30 * months)
}

App.get_history = async (query = ``, deep = false) => {
  App.getting(`history`)
  let results, max_items

  if (query && App.get_setting(`auto_deep_search_history`)) {
    deep = true
  }

  if (deep) {
    max_items = App.get_setting(`deep_max_search_items_history`)
  }
  else {
    max_items = App.get_setting(`max_search_items_history`)
  }

  console.log(111)

  try {
    results = await browser.history.search({
      text: ``,
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

App.history_action = (args = {}) => {
  let def_args = {
    on_action: true,
  }

  App.def_args(def_args, args)
  App.select_item({item: args.item, scroll: `nearest_smooth`})

  if (args.on_action) {
    App.on_action(`history`)
  }

  App.focus_or_open_item(args.item)
}