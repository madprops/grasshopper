App.setup_closed = () => {
  App.closed_filter_modes = [
    [App.separator_string],
    [`star`, `Has Star`],
  ]

  App.closed_actions = [
    {text: `Forget All`, get_items: () => {
      App.forget_closed_tabs()
    }}
  ]

  App.setup_item_window(`closed`)

  browser.sessions.onChanged.addListener(() => {
    if (App.window_mode === `closed`) {
      App.show_mode(`closed`)
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

  if (closed && closed.length > 0) {
    browser.sessions.restore(closed[0].sessionId)
  }
}

App.forget_closed_tabs = async () => {
  App.show_confirm(`Forget closed tabs?`, () => {
    for (let item of App.get_items(`closed`)) {
      browser.sessions.forgetClosedTab(item.window_id, item.session_id)
    }
  })
}