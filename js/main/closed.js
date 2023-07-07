App.setup_closed = () => {
  App.closed_filter_modes = [
    [App.separator_string],
    [`star`, `Has Star`],
  ]

  App.setup_item_window(`closed`)

  browser.sessions.onChanged.addListener(() => {
    if (App.window_mode === `closed`) {
      App.show_item_window(`closed`)
    }
  })
}

App.get_closed = async () => {
  App.log(`Getting closed`)
  let results

  try {
    results = await browser.sessions.getRecentlyClosed({
      maxResults: App.max_closed
    })
  }
  catch (err) {
    App.log(err, `error`)
    return []
  }

  return results.map(x => x.tab)
}

App.closed_action = (item) => {
  App.item_action(item)
}

App.closed_action_alt = (item) => {
  App.open_items(item, true)
}

App.undo_close_tab = async () => {
  let closed = await App.get_closed()
  console.log(closed)

  if (closed && closed.length > 0) {
    browser.sessions.restore(closed[0].sessionId)
  }
}