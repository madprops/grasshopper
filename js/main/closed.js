App.setup_closed = () => {
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
    return
  }

  return results.map(x => x.tab)
}

App.closed_action = (item) => {
  App.item_action(item)
}

App.closed_action_alt = (item) => {
  App.item_action(item, false)
}